import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { YouTubeChatMessage } from './youtube.service';
import { FilterResult } from './chat-filter.service';
import { MessageStorageService } from './message-storage.service';
import { OpenAIService, ChatMessage as AIChatMessage } from './openai.service';
import { EscalationService, EscalationContext } from './escalation.service';
import { Message } from '../entities/message.entity';

export interface QueueMessage {
  id: string;
  message: YouTubeChatMessage;
  filterResult: FilterResult;
  streamId: string;
  priority: number;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

export interface QueueStats {
  totalProcessed: number;
  totalFailed: number;
  queueSize: number;
  processingRate: number;
  averageProcessingTime: number;
  priorityDistribution: Record<string, number>;
}

export interface QueueConfig {
  maxQueueSize: number;
  batchSize: number;
  processingInterval: number;
  maxRetries: number;
  priorityLevels: {
    high: number;
    normal: number;
    low: number;
  };
}

@Injectable()
export class ChatQueueService extends EventEmitter {
  private readonly logger = new Logger(ChatQueueService.name);

  private highPriorityQueue: QueueMessage[] = [];
  private normalPriorityQueue: QueueMessage[] = [];
  private lowPriorityQueue: QueueMessage[] = [];

  private isProcessing = false;
  private processingInterval?: NodeJS.Timeout;
  private stats = {
    totalProcessed: 0,
    totalFailed: 0,
    processingStartTime: new Date(),
    lastProcessingTime: 0,
  };

  private readonly config: QueueConfig = {
    maxQueueSize: 10000,
    batchSize: 50,
    processingInterval: 100, // 100ms
    maxRetries: 3,
    priorityLevels: {
      high: 1,
      normal: 2,
      low: 3,
    },
  };

  constructor(
    private readonly messageStorageService: MessageStorageService,
    private readonly openaiService: OpenAIService,
    private readonly escalationService: EscalationService,
  ) {
    super();
    this.startProcessing();
  }

  enqueueMessage(
    message: YouTubeChatMessage,
    filterResult: FilterResult,
    streamId: string,
    priority: 'high' | 'normal' | 'low' = 'normal',
  ): boolean {
    // Only enqueue if message is approved
    if (!filterResult.isApproved) {
      this.logger.debug(`Message rejected: ${filterResult.reason}`);
      return false;
    }

    const queueMessage: QueueMessage = {
      id: `${message.id}-${Date.now()}`,
      message,
      filterResult,
      streamId,
      priority: this.config.priorityLevels[priority],
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.config.maxRetries,
    };

    // Check if queue is full
    if (this.getTotalQueueSize() >= this.config.maxQueueSize) {
      this.logger.warn('Queue is full, dropping message');
      return false;
    }

    // Add to appropriate queue based on priority
    switch (priority) {
      case 'high':
        this.highPriorityQueue.push(queueMessage);
        break;
      case 'normal':
        this.normalPriorityQueue.push(queueMessage);
        break;
      case 'low':
        this.lowPriorityQueue.push(queueMessage);
        break;
    }

    this.logger.debug(
      `Enqueued message with priority ${priority}: ${filterResult.filteredContent || message.content}`,
    );
    return true;
  }

  // Add this method to allow manual AI response triggering
  enqueueManualAIResponse(message: Message) {
    // Only enqueue if not already processed and requires response
    if (!message.requiresResponse) {
      this.logger.debug(
        `Message ${message.id} does not require response, skipping.`,
      );
      return;
    }
    // Create a minimal QueueMessage for AI response
    const queueMessage = {
      id: `${message.id}-manual-ai-${Date.now()}`,
      message: {
        id: message.platformMessageId,
        authorId: message.authorId,
        authorName: message.authorName,
        authorAvatar: message.authorAvatar,
        content: message.content,
        metadata: message.metadata,
        timestamp: message.createdAt,
      },
      filterResult: {
        isApproved: true,
        filteredContent: message.content,
        flags: [],
        isSpam: false,
        isRelevant: true,
        confidence: 1.0,
      },
      streamId: message.streamId,
      priority: this.config.priorityLevels.high,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.config.maxRetries,
    };
    this.highPriorityQueue.push(queueMessage);
    this.logger.log(
      `Manually enqueued message ${message.id} for AI response. Queue size: ${this.highPriorityQueue.length}`,
    );
  }

  private getTotalQueueSize(): number {
    return (
      this.highPriorityQueue.length +
      this.normalPriorityQueue.length +
      this.lowPriorityQueue.length
    );
  }

  private startProcessing(): void {
    this.processingInterval = setInterval(() => {
      if (!this.isProcessing) {
        this.processBatch();
      }
    }, this.config.processingInterval);
  }

  private async processBatch(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Process messages in priority order
      const batch = this.getNextBatch();

      if (batch.length === 0) {
        this.isProcessing = false;
        return;
      }

      // Process batch
      await this.processMessages(batch);

      // Update stats
      this.stats.totalProcessed += batch.length;
      this.stats.lastProcessingTime = Date.now() - startTime;

      this.logger.debug(`Processed batch of ${batch.length} messages`);
    } catch (error) {
      this.logger.error('Error processing message batch:', error);
      this.stats.totalFailed += 1;
    } finally {
      this.isProcessing = false;
    }
  }

  private getNextBatch(): QueueMessage[] {
    const batch: QueueMessage[] = [];

    // Get messages from high priority queue first
    while (
      batch.length < this.config.batchSize &&
      this.highPriorityQueue.length > 0
    ) {
      batch.push(this.highPriorityQueue.shift()!);
    }

    // Then normal priority
    while (
      batch.length < this.config.batchSize &&
      this.normalPriorityQueue.length > 0
    ) {
      batch.push(this.normalPriorityQueue.shift()!);
    }

    // Finally low priority
    while (
      batch.length < this.config.batchSize &&
      this.lowPriorityQueue.length > 0
    ) {
      batch.push(this.lowPriorityQueue.shift()!);
    }

    return batch;
  }

  private async processMessages(messages: QueueMessage[]): Promise<void> {
    const processingPromises = messages.map((message) =>
      this.processMessage(message),
    );

    // Process messages concurrently but limit concurrency
    const results = await Promise.allSettled(processingPromises);

    // Handle failed messages
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const message = messages[index];
        this.handleFailedMessage(message);
      }
    });
  }

  private async processMessage(queueMessage: QueueMessage): Promise<void> {
    try {
      this.logger.debug(`Processing message: ${queueMessage.id}`);

      // Store the message
      const storedMessage = await this.messageStorageService.storeMessage({
        streamId: queueMessage.streamId,
        platformMessageId: queueMessage.message.id,
        authorId: queueMessage.message.authorId,
        authorName: queueMessage.message.authorName,
        authorAvatar: queueMessage.message.authorAvatar,
        content: queueMessage.message.content,
        metadata: queueMessage.message.metadata,
      });

      // Check for escalation before AI response
      // Get streamerId from the stream (we'll need to fetch the stream)
      const stream = await this.messageStorageService.getStream(
        storedMessage.streamId,
      );
      const escalationContext: EscalationContext = {
        message: storedMessage,
        streamerId: stream?.streamerId || 'unknown',
        streamId: storedMessage.streamId,
        chatHistory:
          await this.messageStorageService.getRecentMessagesForStream(
            storedMessage.streamId,
            10,
          ),
        userImportance: 0.5, // Default importance, can be enhanced
        streamContext: 'general',
        currentTime: new Date(),
      };

      const escalationResult =
        await this.escalationService.checkForEscalation(escalationContext);

      if (escalationResult.shouldEscalate) {
        this.logger.log(
          `Message escalated: ${storedMessage.content} - ${escalationResult.reason}`,
        );
        // Don't generate AI response for escalated messages
        this.emit('message.escalated', {
          message: storedMessage,
          escalationResult,
        });
        return;
      }

      // Emit the message for processing
      this.emit('message.process', {
        message: queueMessage.message,
        filteredMessage: queueMessage.filterResult,
        priority: queueMessage.priority,
      });

      this.logger.debug(
        `Processed and stored message: ${queueMessage.filterResult.filteredContent || queueMessage.message.content}`,
      );

      // AI response generation
      if (storedMessage.requiresResponse) {
        this.logger.log(
          `Generating AI response for message: ${storedMessage.content}`,
        );
        try {
          // Prepare chat history (fetch last 10 messages for the stream)
          const chatHistory =
            await this.messageStorageService.getRecentMessagesForStream(
              storedMessage.streamId,
              10,
            );
          const aiHistory: AIChatMessage[] = chatHistory
            .filter((msg) => msg.id !== storedMessage.id)
            .map((msg) => ({
              role:
                msg.authorId === storedMessage.authorId ? 'user' : 'assistant',
              content: msg.content,
            }));

          this.logger.debug(
            `Chat history prepared with ${aiHistory.length} messages`,
          );

          // Generate AI response
          const aiResponse = await this.openaiService.generateChatResponse(
            storedMessage.content,
            aiHistory,
            undefined,
            {
              maxTokens: 100,
              temperature: 0.7,
            },
          );

          this.logger.log(`AI response generated: ${aiResponse.content}`);

          // Store AI response in the database (associate with message)
          await this.messageStorageService.storeAIResponse(
            storedMessage.id,
            aiResponse.content,
            aiResponse.model,
            aiResponse.usage,
          );

          this.logger.log(
            `AI response stored in database for message ${storedMessage.id}`,
          );

          // Broadcast AI response (emit event)
          this.emit('ai.response', {
            streamId: storedMessage.streamId,
            messageId: storedMessage.id,
            aiResponse: aiResponse.content,
          });

          this.logger.log(
            `AI response generated and stored for message ${storedMessage.id}`,
          );
        } catch (aiError) {
          this.logger.error(
            `Failed to generate/store AI response for message ${storedMessage.id}:`,
            aiError,
          );
        }
      } else {
        this.logger.debug(
          `Message ${storedMessage.id} does not require AI response`,
        );
      }
    } catch (error) {
      this.logger.error(`Error processing message ${queueMessage.id}:`, error);
      throw error;
    }
  }

  private handleFailedMessage(queueMessage: QueueMessage): void {
    queueMessage.retryCount++;

    if (queueMessage.retryCount < queueMessage.maxRetries) {
      // Re-queue with lower priority
      const newPriority = this.getLowerPriority(queueMessage.priority);
      this.enqueueMessage(
        queueMessage.message,
        queueMessage.filterResult,
        queueMessage.streamId,
        newPriority,
      );
      this.logger.warn(
        `Re-queued failed message ${queueMessage.id} with retry ${queueMessage.retryCount}`,
      );
    } else {
      // Max retries reached, drop the message
      this.stats.totalFailed++;
      this.logger.error(
        `Dropped message ${queueMessage.id} after ${queueMessage.maxRetries} retries`,
      );
    }
  }

  private getLowerPriority(currentPriority: number): 'high' | 'normal' | 'low' {
    if (currentPriority === this.config.priorityLevels.high) {
      return 'normal';
    } else if (currentPriority === this.config.priorityLevels.normal) {
      return 'low';
    } else {
      return 'low';
    }
  }

  getStats(): QueueStats {
    const uptime = Date.now() - this.stats.processingStartTime.getTime();
    const processingRate =
      uptime > 0 ? (this.stats.totalProcessed / uptime) * 1000 : 0;

    const priorityDistribution = {
      high: this.highPriorityQueue.length,
      normal: this.normalPriorityQueue.length,
      low: this.lowPriorityQueue.length,
    };

    return {
      totalProcessed: this.stats.totalProcessed,
      totalFailed: this.stats.totalFailed,
      queueSize: this.getTotalQueueSize(),
      processingRate,
      averageProcessingTime: this.stats.lastProcessingTime,
      priorityDistribution,
    };
  }

  updateConfig(newConfig: Partial<QueueConfig>): void {
    Object.assign(this.config, newConfig);
    this.logger.log('Queue configuration updated');
  }

  getConfig(): QueueConfig {
    return { ...this.config };
  }

  clearQueue(): void {
    this.highPriorityQueue = [];
    this.normalPriorityQueue = [];
    this.lowPriorityQueue = [];
    this.logger.log('Queue cleared');
  }

  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
    this.logger.log('Queue processing stopped');
  }

  onMessageProcessed(
    listener: (data: {
      message: YouTubeChatMessage;
      filteredMessage: FilterResult;
      priority: number;
    }) => void,
  ): void {
    this.on('message.process', listener);
  }
}
