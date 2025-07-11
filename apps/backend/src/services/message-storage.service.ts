import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Response as AIResponse } from '../entities/response.entity';
import { ChatFilterService } from './chat-filter.service';

export interface MessageQuery {
  streamId?: string;
  authorId?: string;
  platformMessageId?: string;
  authorName?: string;
  processingStatus?: string;
  requiresResponse?: boolean;
  isEscalated?: boolean;
  startDate?: Date;
  endDate?: Date;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

interface MessageMetadata {
  isModerator?: boolean;
  isSubscriber?: boolean;
  userBadges?: string[];
  emotes?: string[];
  timestamp?: string;
  [key: string]: any;
}

export interface MessageAnalytics {
  totalMessages: number;
  uniqueAuthors: number;
  averageMessagesPerMinute: number;
  topAuthors: Array<{ authorName: string; messageCount: number }>;
  processingStatusDistribution: Record<string, number>;
  questionAnalysis: {
    totalQuestions: number;
    gameSpecificQuestions: number;
    generalQuestions: number;
    technicalQuestions: number;
  };
  sentimentAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
  };
  responseRate: number;
  escalationRate: number;
}

@Injectable()
export class MessageStorageService {
  private readonly logger = new Logger(MessageStorageService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(AIResponse)
    private readonly responseRepository: Repository<AIResponse>,
    private readonly chatFilterService: ChatFilterService,
  ) {}

  async storeMessage(messageData: {
    streamId: string;
    platformMessageId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    metadata?: MessageMetadata;
  }): Promise<Message> {
    try {
      // Filter the message content before storing
      const filterResult = this.chatFilterService.filterMessage(
        messageData.content,
      );

      if (!filterResult.isApproved) {
        this.logger.warn(`Message rejected: ${filterResult.reason}`);
        throw new Error(`Message rejected: ${filterResult.reason}`);
      }

      // Sanitize the content
      const sanitizedContent = this.chatFilterService.sanitizeMessage(
        filterResult.filteredContent || messageData.content,
      );

      // Analyze message for response requirements
      const analysis = this.analyzeMessage(sanitizedContent);

      const message = this.messageRepository.create({
        streamId: messageData.streamId,
        platformMessageId: messageData.platformMessageId,
        authorId: messageData.authorId,
        authorName: messageData.authorName,
        authorAvatar: messageData.authorAvatar,
        content: sanitizedContent,
        requiresResponse: analysis.requiresResponse,
        metadata: {
          isModerator: messageData.metadata?.isModerator || false,
          isSubscriber: messageData.metadata?.isSubscriber || false,
          badges: messageData.metadata?.userBadges || [],
          emotes: messageData.metadata?.emotes || [],
          timestamp: new Date(),
        },
      });

      const savedMessage = await this.messageRepository.save(message);
      this.logger.log(`Message stored: ${savedMessage.id}`);

      return savedMessage;
    } catch (error) {
      this.logger.error('Error storing message:', error);
      throw error;
    }
  }

  async getMessages(
    query: MessageQuery,
  ): Promise<{ messages: Message[]; total: number }> {
    try {
      const queryBuilder = this.messageRepository.createQueryBuilder('message');

      // Apply filters
      if (query.streamId) {
        queryBuilder.andWhere('message.streamId = :streamId', {
          streamId: query.streamId,
        });
      }

      if (query.authorId) {
        queryBuilder.andWhere('message.authorId = :authorId', {
          authorId: query.authorId,
        });
      }

      if (query.authorName) {
        queryBuilder.andWhere('message.authorName ILIKE :authorName', {
          authorName: `%${query.authorName}%`,
        });
      }

      if (query.processingStatus) {
        queryBuilder.andWhere('message.processingStatus = :status', {
          status: query.processingStatus,
        });
      }

      if (query.requiresResponse !== undefined) {
        queryBuilder.andWhere('message.requiresResponse = :requiresResponse', {
          requiresResponse: query.requiresResponse,
        });
      }

      if (query.isEscalated !== undefined) {
        queryBuilder.andWhere('message.isEscalated = :isEscalated', {
          isEscalated: query.isEscalated,
        });
      }

      if (query.startDate && query.endDate) {
        queryBuilder.andWhere(
          'message.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: query.startDate,
            endDate: query.endDate,
          },
        );
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply ordering
      const orderBy = query.orderBy || 'createdAt';
      const orderDirection = query.orderDirection || 'DESC';
      queryBuilder.orderBy(`message.${orderBy}`, orderDirection);

      // Apply pagination
      if (query.limit) {
        queryBuilder.limit(query.limit);
      }
      if (query.offset) {
        queryBuilder.offset(query.offset);
      }

      const messages = await queryBuilder.getMany();

      return { messages, total };
    } catch (error) {
      this.logger.error('Error retrieving messages:', error);
      throw error;
    }
  }

  async getMessageById(messageId: string): Promise<Message | null> {
    try {
      return await this.messageRepository.findOne({
        where: { id: messageId },
        relations: ['stream', 'response'],
      });
    } catch (error) {
      this.logger.error(`Error retrieving message ${messageId}:`, error);
      throw error;
    }
  }

  async getAnalytics(
    streamId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<MessageAnalytics> {
    try {
      const queryBuilder = this.messageRepository.createQueryBuilder('message');
      queryBuilder.where('message.streamId = :streamId', { streamId });

      if (startDate && endDate) {
        queryBuilder.andWhere(
          'message.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      }

      const messages = await queryBuilder.getMany();

      // Calculate analytics
      const totalMessages = messages.length;
      const uniqueAuthors = new Set(messages.map((m) => m.authorId)).size;

      // Calculate messages per minute
      const timeRange =
        endDate && startDate
          ? (endDate.getTime() - startDate.getTime()) / (1000 * 60)
          : 60; // Default to 1 hour
      const averageMessagesPerMinute = totalMessages / timeRange;

      // Top authors
      const authorCounts = messages.reduce(
        (acc, message) => {
          acc[message.authorName] = (acc[message.authorName] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const topAuthors = Object.entries(authorCounts)
        .map(([authorName, messageCount]) => ({ authorName, messageCount }))
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 10);

      // Processing status distribution
      const processingStatusDistribution = messages.reduce(
        (acc, message) => {
          acc[message.processingStatus] =
            (acc[message.processingStatus] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Question analysis
      const questions = messages.filter((m) => m.analysis?.isQuestion);
      const questionAnalysis = {
        totalQuestions: questions.length,
        gameSpecificQuestions: questions.filter(
          (q) => q.analysis?.questionType === 'game-specific',
        ).length,
        generalQuestions: questions.filter(
          (q) => q.analysis?.questionType === 'general',
        ).length,
        technicalQuestions: questions.filter(
          (q) => q.analysis?.questionType === 'technical',
        ).length,
      };

      // Sentiment analysis
      const sentimentAnalysis = {
        positive: messages.filter((m) => m.analysis?.sentiment === 'positive')
          .length,
        negative: messages.filter((m) => m.analysis?.sentiment === 'negative')
          .length,
        neutral: messages.filter((m) => m.analysis?.sentiment === 'neutral')
          .length,
      };

      // Response and escalation rates
      const responseRate =
        totalMessages > 0
          ? (messages.filter((m) => m.requiresResponse).length /
              totalMessages) *
            100
          : 0;
      const escalationRate =
        totalMessages > 0
          ? (messages.filter((m) => m.isEscalated).length / totalMessages) * 100
          : 0;

      return {
        totalMessages,
        uniqueAuthors,
        averageMessagesPerMinute,
        topAuthors,
        processingStatusDistribution,
        questionAnalysis,
        sentimentAnalysis,
        responseRate,
        escalationRate,
      };
    } catch (error) {
      this.logger.error('Error calculating analytics:', error);
      throw error;
    }
  }

  async updateMessageStatus(
    messageId: string,
    status: 'pending' | 'processed' | 'ignored' | 'error',
  ): Promise<Message | null> {
    try {
      await this.messageRepository.update(messageId, {
        processingStatus: status,
      });
      return await this.getMessageById(messageId);
    } catch (error) {
      this.logger.error(`Error updating message status ${messageId}:`, error);
      throw error;
    }
  }

  async markMessageForResponse(
    messageId: string,
    requiresResponse: boolean,
  ): Promise<Message | null> {
    try {
      this.logger.log(
        `Marking message ${messageId} for response: ${requiresResponse}`,
      );

      await this.messageRepository.update(messageId, { requiresResponse });
      const updated = await this.getMessageById(messageId);

      // Remove the AI response enqueueing logic for now
      // We'll handle this differently
      this.logger.log(
        `Message ${messageId} marked for response: ${requiresResponse}`,
      );

      return updated;
    } catch (error) {
      this.logger.error(
        `Error marking message for response ${messageId}:`,
        error,
      );
      throw error;
    }
  }

  async markMessageEscalated(
    messageId: string,
    isEscalated: boolean,
  ): Promise<Message | null> {
    try {
      await this.messageRepository.update(messageId, { isEscalated });
      return await this.getMessageById(messageId);
    } catch (error) {
      this.logger.error(`Error marking message escalated ${messageId}:`, error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const result = await this.messageRepository.delete(messageId);
      return (result.affected || 0) > 0;
    } catch (error) {
      this.logger.error(`Error deleting message ${messageId}:`, error);
      throw error;
    }
  }

  async storeAIResponse(
    messageId: string,
    aiContent: string,
    model: string,
    usage: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    },
  ): Promise<AIResponse> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    if (!message) throw new Error('Message not found for AI response');
    const response = this.responseRepository.create({
      messageId: message.id,
      content: aiContent,
      metadata: {
        aiModel: model,
        promptTokens: usage?.promptTokens ?? 0,
        completionTokens: usage?.completionTokens ?? 0,
        totalTokens: usage?.totalTokens ?? 0,
        responseTime: 0,
        confidence: 1.0,
      },
      status: 'generated',
    });
    return this.responseRepository.save(response);
  }

  async getRecentMessagesForStream(
    streamId: string,
    limit: number = 10,
  ): Promise<Message[]> {
    return this.messageRepository.find({
      where: { streamId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStream(streamId: string): Promise<{ streamerId: string } | null> {
    try {
      const message = await this.messageRepository.findOne({
        where: { streamId },
        relations: ['stream'],
      });

      if (message?.stream) {
        return { streamerId: message.stream.streamerId };
      }

      return null;
    } catch (error) {
      this.logger.error(`Error retrieving stream ${streamId}:`, error);
      return null;
    }
  }

  private analyzeMessage(content: string): {
    isQuestion: boolean;
    questionType?: 'game-specific' | 'general' | 'technical';
    sentiment?: 'positive' | 'negative' | 'neutral';
    priority?: 'low' | 'medium' | 'high';
    keywords?: string[];
    requiresResponse: boolean;
  } {
    const lowerContent = content.toLowerCase();

    // Question detection
    const isQuestion =
      /\?$/.test(content) ||
      /^(what|how|why|when|where|who|which|can|could|would|will|do|does|did|is|are|was|were)/.test(
        lowerContent,
      );

    // Question type classification
    let questionType: 'game-specific' | 'general' | 'technical' | undefined;
    if (isQuestion) {
      const gameKeywords = [
        'game',
        'play',
        'strategy',
        'level',
        'score',
        'win',
        'lose',
      ];
      const technicalKeywords = [
        'error',
        'bug',
        'crash',
        'lag',
        'fps',
        'settings',
        'config',
      ];

      if (gameKeywords.some((keyword) => lowerContent.includes(keyword))) {
        questionType = 'game-specific';
      } else if (
        technicalKeywords.some((keyword) => lowerContent.includes(keyword))
      ) {
        questionType = 'technical';
      } else {
        questionType = 'general';
      }
    }

    // Sentiment analysis (simple keyword-based)
    const positiveWords = [
      'good',
      'great',
      'awesome',
      'love',
      'amazing',
      'perfect',
      'excellent',
    ];
    const negativeWords = [
      'bad',
      'terrible',
      'hate',
      'awful',
      'worst',
      'horrible',
      'disappointing',
    ];

    const positiveCount = positiveWords.filter((word) =>
      lowerContent.includes(word),
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerContent.includes(word),
    ).length;

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    }

    // Priority determination
    let priority: 'low' | 'medium' | 'high' = 'low';
    if (isQuestion && questionType === 'technical') {
      priority = 'high';
    } else if (isQuestion || sentiment === 'negative') {
      priority = 'medium';
    }

    // Determine if message requires response
    const requiresResponse =
      isQuestion && questionType === 'game-specific' && priority === 'high';

    // Extract keywords (simple approach)
    const keywords = content
      .toLowerCase()
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 3 &&
          ![
            'the',
            'and',
            'for',
            'are',
            'but',
            'not',
            'you',
            'all',
            'can',
            'had',
            'her',
            'was',
            'one',
            'our',
            'out',
            'day',
            'get',
            'has',
            'him',
            'his',
            'how',
            'man',
            'new',
            'now',
            'old',
            'see',
            'two',
            'way',
            'who',
            'boy',
            'did',
            'its',
            'let',
            'put',
            'say',
            'she',
            'too',
            'use',
          ].includes(word),
      )
      .slice(0, 5);

    return {
      isQuestion,
      questionType,
      sentiment,
      priority,
      keywords,
      requiresResponse,
    };
  }
}
