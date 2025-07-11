import { Injectable, Logger } from '@nestjs/common';
import { YouTubeService, YouTubeChatMessage } from './youtube.service';
import { ChatFilterService, FilterResult } from './chat-filter.service';
import { ChatQueueService } from './chat-queue.service';

export interface ChatConnection {
  liveChatId: string;
  videoId: string;
  channelId: string;
  isActive: boolean;
  lastPollTime: Date;
  nextPageToken?: string;
  pollingInterval: number;
  retryCount: number;
  lastError?: string;
  connectionStartTime: Date;
  totalMessagesReceived: number;
  consecutiveErrors: number;
}

export interface ChatMessageEvent {
  liveChatId: string;
  videoId: string;
  message: YouTubeChatMessage;
  filterResult?: FilterResult;
}

export interface ConnectionStats {
  liveChatId: string;
  uptime: number;
  messagesReceived: number;
  consecutiveErrors: number;
  retryCount: number;
  isHealthy: boolean;
}

@Injectable()
export class YouTubeChatService {
  private readonly logger = new Logger(YouTubeChatService.name);
  private activeConnections = new Map<string, ChatConnection>();
  private pollingIntervals = new Map<string, NodeJS.Timeout>();
  private messageListeners: ((event: ChatMessageEvent) => void)[] = [];

  // Connection stability settings
  private readonly maxRetries = 10;
  private readonly maxConsecutiveErrors = 5;
  private readonly baseRetryDelay = 1000; // 1 second
  private readonly maxRetryDelay = 60000; // 1 minute
  private readonly healthCheckInterval = 30000; // 30 seconds

  constructor(
    private readonly youtubeService: YouTubeService,
    private readonly chatFilterService: ChatFilterService,
    private readonly chatQueueService: ChatQueueService,
  ) {
    // Start health check monitoring
    this.startHealthCheck();

    // Listen for processed messages from queue
    this.chatQueueService.onMessageProcessed((data) => {
      this.handleProcessedMessage(data);
    });
  }

  async startChatConnection(
    videoId: string,
    channelId: string,
  ): Promise<ChatConnection | null> {
    try {
      // Get the live chat ID for the video
      const liveChatId = await this.youtubeService.getLiveChatId(videoId);
      if (!liveChatId) {
        this.logger.warn(`No live chat found for video ${videoId}`);
        return null;
      }

      // Check if connection already exists
      if (this.activeConnections.has(liveChatId)) {
        this.logger.log(`Connection already exists for ${liveChatId}`);
        return this.activeConnections.get(liveChatId)!;
      }

      // Create new connection with stability tracking
      const connection: ChatConnection = {
        liveChatId,
        videoId,
        channelId,
        isActive: true,
        lastPollTime: new Date(),
        pollingInterval: 5000, // Default 5 seconds
        retryCount: 0,
        connectionStartTime: new Date(),
        totalMessagesReceived: 0,
        consecutiveErrors: 0,
      };

      this.activeConnections.set(liveChatId, connection);
      this.logger.log(`Started chat connection for ${liveChatId}`);

      // Start polling for messages
      this.startPolling(liveChatId);

      return connection;
    } catch (error) {
      this.logger.error(
        `Failed to start chat connection for ${videoId}:`,
        error,
      );
      return null;
    }
  }

  stopChatConnection(liveChatId: string): boolean {
    try {
      const connection = this.activeConnections.get(liveChatId);
      if (!connection) {
        this.logger.warn(`No active connection found for ${liveChatId}`);
        return false;
      }

      // Stop polling
      this.stopPolling(liveChatId);

      // Mark connection as inactive
      connection.isActive = false;
      this.activeConnections.delete(liveChatId);

      this.logger.log(`Stopped chat connection for ${liveChatId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to stop chat connection for ${liveChatId}:`,
        error,
      );
      return false;
    }
  }

  getActiveConnections(): ChatConnection[] {
    return Array.from(this.activeConnections.values());
  }

  getConnectionStats(liveChatId: string): ConnectionStats | null {
    const connection = this.activeConnections.get(liveChatId);
    if (!connection) return null;

    const uptime = Date.now() - connection.connectionStartTime.getTime();
    const isHealthy = connection.consecutiveErrors < this.maxConsecutiveErrors;

    return {
      liveChatId,
      uptime,
      messagesReceived: connection.totalMessagesReceived,
      consecutiveErrors: connection.consecutiveErrors,
      retryCount: connection.retryCount,
      isHealthy,
    };
  }

  onMessage(listener: (event: ChatMessageEvent) => void): void {
    this.messageListeners.push(listener);
  }

  private startPolling(liveChatId: string): void {
    const connection = this.activeConnections.get(liveChatId);
    if (!connection) return;

    const pollMessages = () => {
      if (!connection.isActive) {
        this.stopPolling(liveChatId);
        return;
      }

      this.youtubeService
        .getChatMessages(liveChatId, connection.nextPageToken)
        .then((result) => {
          // Reset error counters on successful poll
          connection.consecutiveErrors = 0;
          connection.retryCount = 0;
          connection.lastError = undefined;

          // Update connection with new polling interval and page token
          connection.pollingInterval = result.pollingIntervalMillis || 5000;
          connection.nextPageToken = result.nextPageToken;
          connection.lastPollTime = new Date();

          // Process messages through queue pipeline
          for (const message of result.messages) {
            // Filter the message
            const filterResult = this.chatFilterService.filterMessage(message);

            // Determine priority based on message characteristics
            const priority = this.determineMessagePriority(filterResult);

            // Enqueue for processing (pass streamId)
            const enqueued = this.chatQueueService.enqueueMessage(
              message,
              filterResult,
              connection.videoId, // Pass the streamId (videoId)
              priority,
            );

            if (enqueued) {
              connection.totalMessagesReceived++;
              this.logger.debug(
                `Enqueued message with priority ${priority}: ${filterResult.filteredContent}`,
              );
            } else {
              this.logger.warn(
                `Failed to enqueue message: ${filterResult.filteredContent}`,
              );
            }
          }

          // Schedule next poll
          const timeout = setTimeout(pollMessages, connection.pollingInterval);
          this.pollingIntervals.set(liveChatId, timeout);
        })
        .catch((error: unknown) => {
          connection.consecutiveErrors++;
          connection.lastError =
            error instanceof Error ? error.message : 'Unknown error';

          this.logger.error(`Error polling messages for ${liveChatId}:`, error);

          // Check if we should stop the connection
          if (connection.consecutiveErrors >= this.maxConsecutiveErrors) {
            this.logger.error(
              `Max consecutive errors reached for ${liveChatId}, stopping connection`,
            );
            this.stopChatConnection(liveChatId);
            return;
          }

          // Calculate retry delay with exponential backoff
          const retryDelay = this.calculateRetryDelay(connection.retryCount);
          connection.retryCount++;

          this.logger.warn(
            `Retrying connection for ${liveChatId} in ${retryDelay}ms (attempt ${connection.retryCount}/${this.maxRetries})`,
          );

          // Schedule retry with exponential backoff
          const timeout = setTimeout(pollMessages, retryDelay);
          this.pollingIntervals.set(liveChatId, timeout);
        });
    };

    // Start initial poll
    pollMessages();
  }

  private determineMessagePriority(
    filterResult: FilterResult,
  ): 'high' | 'normal' | 'low' {
    // High priority: Messages from moderators, owners, or with high confidence
    if (
      (filterResult.metadata as any)?.isModerator ||
      (filterResult.metadata as any)?.isOwner ||
      filterResult.confidence > 0.8
    ) {
      return 'high';
    }

    // Low priority: Spam or irrelevant messages
    if (filterResult.isSpam || !filterResult.isRelevant) {
      return 'low';
    }

    // Normal priority: Everything else
    return 'normal';
  }

  private handleProcessedMessage(data: {
    message: YouTubeChatMessage;
    filterResult: FilterResult;
    priority: number;
  }): void {
    // Only emit messages that are relevant and not spam
    if (data.filterResult.isRelevant && !data.filterResult.isSpam) {
      const event: ChatMessageEvent = {
        liveChatId: '', // Will be set by the connection that processed it
        videoId: '', // Will be set by the connection that processed it
        message: data.message,
        filterResult: data.filterResult,
      };

      this.emitMessage(event);
      this.logger.debug(
        `Emitted processed message: ${data.filterResult.filteredContent}`,
      );
    }
  }

  private calculateRetryDelay(retryCount: number): number {
    const delay = Math.min(
      this.baseRetryDelay * Math.pow(2, retryCount),
      this.maxRetryDelay,
    );
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }

  private stopPolling(liveChatId: string): void {
    const interval = this.pollingIntervals.get(liveChatId);
    if (interval) {
      clearTimeout(interval);
      this.pollingIntervals.delete(liveChatId);
    }
  }

  private startHealthCheck(): void {
    setInterval(() => {
      for (const [liveChatId, connection] of this.activeConnections) {
        const stats = this.getConnectionStats(liveChatId);
        if (stats && !stats.isHealthy) {
          this.logger.warn(
            `Unhealthy connection detected: ${liveChatId}, consecutive errors: ${connection.consecutiveErrors}`,
          );
        }
      }
    }, this.healthCheckInterval);
  }

  private emitMessage(event: ChatMessageEvent): void {
    for (const listener of this.messageListeners) {
      try {
        listener(event);
      } catch (error) {
        this.logger.error('Error in message listener:', error);
      }
    }
  }

  async sendMessage(liveChatId: string, message: string): Promise<boolean> {
    try {
      await this.youtubeService.insertChatMessage(liveChatId, message);
      this.logger.log(`Message sent to ${liveChatId}: ${message}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send message to ${liveChatId}:`, error);
      return false;
    }
  }

  getConnectionStatus(liveChatId: string): ChatConnection | null {
    return this.activeConnections.get(liveChatId) || null;
  }

  stopAllConnections(): void {
    const liveChatIds = Array.from(this.activeConnections.keys());
    for (const liveChatId of liveChatIds) {
      this.stopChatConnection(liveChatId);
    }
  }

  // Force reconnect a specific connection
  async forceReconnect(liveChatId: string): Promise<boolean> {
    const connection = this.activeConnections.get(liveChatId);
    if (!connection) {
      this.logger.warn(`No connection found to reconnect: ${liveChatId}`);
      return false;
    }

    this.logger.log(`Force reconnecting ${liveChatId}`);

    // Stop current connection
    this.stopChatConnection(liveChatId);

    // Wait a moment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Start new connection
    const newConnection = await this.startChatConnection(
      connection.videoId,
      connection.channelId,
    );
    return newConnection !== null;
  }
}
