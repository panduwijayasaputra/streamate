import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Response as AIResponse } from '../entities/response.entity';
import { OpenAIService, ChatMessage as AIChatMessage } from './openai.service';
import {
  StreamerProfileService,
  PersonalizationContext,
} from './streamer-profile.service';
import { ResponseCacheService, CacheKey } from './response-cache.service';
import { ResponseFrequencyLimiterService } from './response-frequency-limiter.service';

@Injectable()
export class AIResponseService {
  private readonly logger = new Logger(AIResponseService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(AIResponse)
    private readonly responseRepository: Repository<AIResponse>,
    private readonly openaiService: OpenAIService,
    private readonly streamerProfileService: StreamerProfileService,
    private readonly responseCacheService: ResponseCacheService,
    private readonly frequencyLimiter: ResponseFrequencyLimiterService,
  ) {}

  async generateAIResponseForMessage(
    messageId: string,
  ): Promise<AIResponse | null> {
    try {
      this.logger.log(`Generating AI response for message: ${messageId}`);

      // Get the message
      const message = await this.messageRepository.findOne({
        where: { id: messageId },
        relations: ['stream'],
      });

      if (!message) {
        this.logger.error(`Message ${messageId} not found`);
        return null;
      }

      if (!message.requiresResponse) {
        this.logger.log(`Message ${messageId} does not require response`);
        return null;
      }

      // Check frequency limits
      const frequencyCheck = this.frequencyLimiter.canRespond(message.streamId);
      if (!frequencyCheck.allowed) {
        this.logger.log(
          `AI response blocked for message ${messageId}: ${frequencyCheck.reason}`,
        );
        return null;
      }

      // Get recent messages for context (last 10 messages for the stream)
      const recentMessages = await this.messageRepository.find({
        where: { streamId: message.streamId },
        order: { createdAt: 'DESC' },
        take: 10,
      });

      // Create personalization context
      const personalizationContext: PersonalizationContext = {
        streamerId: message.stream?.streamerId || 'default',
        streamId: message.streamId,
        userId: message.authorId,
        messageType: this.determineMessageType(message.content),
        chatHistory: recentMessages.map((msg) => ({
          authorId: msg.authorId,
          content: msg.content,
          timestamp: msg.createdAt,
        })),
      };

      // Generate cache key
      const cacheKey: CacheKey = {
        messageContent: message.content,
        streamerId: personalizationContext.streamerId,
        contextHash: this.generateContextHash(recentMessages),
        personalizationHash: this.generatePersonalizationHash(
          personalizationContext,
        ),
      };

      // Check cache first
      const cachedResponse =
        this.responseCacheService.getCachedResponse(cacheKey);
      if (cachedResponse) {
        this.logger.log(`Using cached response for message: ${messageId}`);

        // Store cached response in database
        const response = this.responseRepository.create({
          messageId: message.id,
          content: cachedResponse.content,
          metadata: {
            ...cachedResponse.metadata,
            personalizationContext,
            cacheHit: true,
          },
          status: 'generated',
        });

        const savedResponse = await this.responseRepository.save(response);
        this.logger.log(
          `Cached AI response stored in database for message ${messageId}`,
        );

        // Record the response for frequency limiting
        this.frequencyLimiter.recordResponse(message.streamId);

        return savedResponse;
      }

      // Prepare chat history
      const aiHistory: AIChatMessage[] = recentMessages
        .filter((msg) => msg.id !== message.id)
        .map((msg) => ({
          role: msg.authorId === message.authorId ? 'user' : 'assistant',
          content: msg.content,
        }));

      this.logger.debug(
        `Chat history prepared with ${aiHistory.length} messages`,
      );

      // Generate personalized system prompt
      const personalizedPrompt =
        await this.streamerProfileService.generatePersonalizedSystemPrompt(
          personalizationContext,
        );

      // Generate AI response
      const aiResponse = await this.openaiService.generateChatResponse(
        message.content,
        aiHistory,
        personalizedPrompt,
        {
          maxTokens: 100,
          temperature: 0.9,
        },
      );

      this.logger.log(`AI response generated: ${aiResponse.content}`);

      // Cache the response
      this.responseCacheService.cacheResponse(cacheKey, {
        content: aiResponse.content,
        metadata: {
          aiModel: aiResponse.model,
          promptTokens: aiResponse.usage?.promptTokens ?? 0,
          completionTokens: aiResponse.usage?.completionTokens ?? 0,
          totalTokens: aiResponse.usage?.totalTokens ?? 0,
          responseTime: 0,
          confidence: 1.0,
        },
      });

      // Store AI response in the database
      const response = this.responseRepository.create({
        messageId: message.id,
        content: aiResponse.content,
        metadata: {
          aiModel: aiResponse.model,
          promptTokens: aiResponse.usage?.promptTokens ?? 0,
          completionTokens: aiResponse.usage?.completionTokens ?? 0,
          totalTokens: aiResponse.usage?.totalTokens ?? 0,
          responseTime: 0,
          confidence: 1.0,
          personalizationContext,
          cacheHit: false,
        },
        status: 'generated',
      });

      const savedResponse = await this.responseRepository.save(response);
      this.logger.log(
        `AI response stored in database for message ${messageId}`,
      );

      // Record the response for frequency limiting
      this.frequencyLimiter.recordResponse(message.streamId);

      return savedResponse;
    } catch (error) {
      this.logger.error(
        `Failed to generate AI response for message ${messageId}:`,
        error,
      );
      return null;
    }
  }

  async getAIResponseForMessage(messageId: string): Promise<AIResponse[]> {
    try {
      const responses = await this.responseRepository.find({
        where: { messageId },
        order: { createdAt: 'DESC' },
      });
      return responses;
    } catch (error) {
      this.logger.error(
        `Failed to get AI responses for message ${messageId}:`,
        error,
      );
      return [];
    }
  }

  private determineMessageType(
    content: string,
  ): 'question' | 'comment' | 'greeting' | 'farewell' {
    const lowerContent = content.toLowerCase();

    // Check for greetings
    if (
      lowerContent.includes('halo') ||
      lowerContent.includes('hello') ||
      lowerContent.includes('hi') ||
      lowerContent.includes('selamat pagi') ||
      lowerContent.includes('selamat siang') ||
      lowerContent.includes('selamat malam')
    ) {
      return 'greeting';
    }

    // Check for farewells
    if (
      lowerContent.includes('bye') ||
      lowerContent.includes('sampai jumpa') ||
      lowerContent.includes('see you') ||
      lowerContent.includes('goodbye')
    ) {
      return 'farewell';
    }

    // Check for questions
    if (
      lowerContent.includes('?') ||
      lowerContent.includes('apa') ||
      lowerContent.includes('bagaimana') ||
      lowerContent.includes('kapan') ||
      lowerContent.includes('dimana') ||
      lowerContent.includes('siapa') ||
      lowerContent.includes('kenapa') ||
      lowerContent.includes('mengapa')
    ) {
      return 'question';
    }

    // Default to comment
    return 'comment';
  }

  private generateContextHash(messages: Message[]): string {
    // Create a hash based on recent message content
    const content = messages
      .slice(0, 5) // Use last 5 messages for context
      .map((msg) => msg.content)
      .join('|');

    return Buffer.from(content).toString('base64').slice(0, 16);
  }

  private generatePersonalizationHash(context: PersonalizationContext): string {
    // Create a hash based on personalization context
    const contextData = {
      streamerId: context.streamerId,
      messageType: context.messageType,
      // Exclude chatHistory as it changes frequently
    };

    return Buffer.from(JSON.stringify(contextData))
      .toString('base64')
      .slice(0, 16);
  }
}
