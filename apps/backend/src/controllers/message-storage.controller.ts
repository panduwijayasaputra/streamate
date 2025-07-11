import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  MessageStorageService,
  MessageQuery,
  MessageAnalytics,
} from '../services/message-storage.service';
import { Message } from '../entities/message.entity';
import { Response as AIResponse } from '../entities/response.entity';
import { AIResponseService } from '../services/ai-response.service';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  MaxLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  streamId: string;

  @IsString()
  @IsNotEmpty()
  platformMessageId: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsString()
  @IsOptional()
  authorAvatar?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export interface UpdateMessageDto {
  processingStatus?: 'pending' | 'processed' | 'ignored' | 'error';
  requiresResponse?: boolean;
  isEscalated?: boolean;
  analysis?: any;
}

@Controller('messages')
export class MessageStorageController {
  private readonly logger = new Logger(MessageStorageController.name);

  constructor(
    private readonly messageStorageService: MessageStorageService,
    private readonly aiResponseService: AIResponseService,
  ) {}

  @Get()
  async getMessages(@Query() query: MessageQuery): Promise<{
    messages: Message[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { messages, total } =
        await this.messageStorageService.getMessages(query);
      const page = Math.floor((query.offset || 0) / (query.limit || 10)) + 1;
      const limit = query.limit || 10;

      return {
        messages,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        'Error retrieving messages:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to retrieve messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getMessageById(@Param('id') id: string): Promise<Message> {
    try {
      const message = await this.messageStorageService.getMessageById(id);
      if (!message) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      return message;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error retrieving message ${id}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to retrieve message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stream/:streamId/analytics')
  async getMessageAnalytics(
    @Param('streamId') streamId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<MessageAnalytics> {
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      return await this.messageStorageService.getAnalytics(
        streamId,
        start,
        end,
      );
    } catch (error) {
      this.logger.error(
        `Error retrieving analytics for stream ${streamId}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to retrieve analytics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    try {
      this.logger.log('Creating message with DTO:', createMessageDto);

      // Sanitize the content field
      const sanitizedContent = this.sanitizeContent(createMessageDto.content);
      createMessageDto.content = sanitizedContent;

      // This endpoint is mainly for testing - in production, messages are created
      // through the chat processing pipeline
      const message = new Message();
      Object.assign(message, createMessageDto);

      // Set default values
      message.processingStatus = 'pending';
      message.requiresResponse = false;
      message.isEscalated = false;

      // Simple analysis
      const analysis = this.analyzeMessage(createMessageDto.content);
      message.analysis = analysis;

      this.logger.log('Message object before save:', message);

      const savedMessage =
        await this.messageStorageService['messageRepository'].save(message);
      this.logger.log(`Created message: ${savedMessage.id}`);
      return savedMessage;
    } catch (error) {
      this.logger.error(
        'Error creating message:',
        error instanceof Error ? error.message : error,
      );
      this.logger.error(
        'Error stack:',
        error instanceof Error ? error.stack : 'No stack trace',
      );
      throw new HttpException(
        'Failed to create message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/status')
  async updateMessageStatus(
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'processed' | 'ignored' | 'error' },
  ): Promise<Message> {
    try {
      const message = await this.messageStorageService.updateMessageStatus(
        id,
        body.status,
      );
      if (!message) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      return message;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error updating message status ${id}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to update message status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/response')
  async markMessageForResponse(
    @Param('id') id: string,
    @Body() body: { requiresResponse: boolean },
  ): Promise<Message> {
    try {
      const message = await this.messageStorageService.markMessageForResponse(
        id,
        body.requiresResponse,
      );
      if (!message) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      return message;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error marking message for response ${id}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to mark message for response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/escalate')
  async markMessageEscalated(
    @Param('id') id: string,
    @Body() body: { isEscalated: boolean },
  ): Promise<Message> {
    try {
      const message = await this.messageStorageService.markMessageEscalated(
        id,
        body.isEscalated,
      );
      if (!message) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      return message;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error marking message escalated ${id}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to mark message escalated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    try {
      // Get the current message
      const currentMessage =
        await this.messageStorageService.getMessageById(id);
      if (!currentMessage) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }

      // Update the message
      Object.assign(currentMessage, updateMessageDto);
      const updatedMessage =
        await this.messageStorageService['messageRepository'].save(
          currentMessage,
        );

      this.logger.log(`Updated message: ${id}`);
      return updatedMessage;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error updating message ${id}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to update message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string): Promise<{ success: boolean }> {
    try {
      const success = await this.messageStorageService.deleteMessage(id);
      if (!success) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`Deleted message: ${id}`);
      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error deleting message ${id}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to delete message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stream/:streamId/questions')
  async getQuestions(
    @Param('streamId') streamId: string,
    @Query() query: MessageQuery,
  ): Promise<{ messages: Message[]; total: number }> {
    try {
      const questionQuery: MessageQuery = {
        ...query,
        streamId,
      };

      const { messages } =
        await this.messageStorageService.getMessages(questionQuery);

      // Filter for questions only
      const questions = messages.filter(
        (message) => message.analysis?.isQuestion,
      );

      return {
        messages: questions,
        total: questions.length,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving questions for stream ${streamId}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to retrieve questions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stream/:streamId/escalated')
  async getEscalatedMessages(
    @Param('streamId') streamId: string,
    @Query() query: MessageQuery,
  ): Promise<{ messages: Message[]; total: number }> {
    try {
      const escalatedQuery: MessageQuery = {
        ...query,
        streamId,
        isEscalated: true,
      };

      return await this.messageStorageService.getMessages(escalatedQuery);
    } catch (error) {
      this.logger.error(
        `Error retrieving escalated messages for stream ${streamId}:`,
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to retrieve escalated messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/response')
  async getAIResponseForMessage(
    @Param('id') id: string,
  ): Promise<AIResponse[]> {
    try {
      const responses =
        await this.aiResponseService.getAIResponseForMessage(id);
      if (!responses || responses.length === 0) {
        throw new HttpException(
          'No AI response found for this message',
          HttpStatus.NOT_FOUND,
        );
      }
      return responses;
    } catch (error) {
      this.logger.error(
        'Error fetching AI response:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to fetch AI response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/generate-response')
  async generateAIResponseForMessage(
    @Param('id') id: string,
  ): Promise<{ success: boolean; response?: any }> {
    try {
      const response =
        await this.aiResponseService.generateAIResponseForMessage(id);
      if (response) {
        return { success: true, response };
      } else {
        return { success: false };
      }
    } catch (error) {
      this.logger.error(
        'Error generating AI response:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to generate AI response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private analyzeMessage(content: string): {
    isQuestion: boolean;
    questionType?: 'game-specific' | 'general' | 'technical';
    sentiment?: 'positive' | 'negative' | 'neutral';
    priority?: 'low' | 'medium' | 'high';
    keywords?: string[];
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
    };
  }

  private sanitizeContent(content: string): string {
    // Remove HTML tags
    const withoutHtml = content.replace(/<[^>]*>/g, '');

    // Remove potentially dangerous characters/sequences
    const sanitized = withoutHtml
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/<script/gi, '')
      .replace(/<\/script>/gi, '');

    // Trim whitespace
    return sanitized.trim();
  }
}
