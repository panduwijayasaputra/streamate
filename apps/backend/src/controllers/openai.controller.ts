import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  OpenAIService,
  ChatMessage,
  ChatResponse,
  OpenAIFilterConfig,
} from '../services/openai.service';

export interface GenerateResponseDto {
  messages: ChatMessage[];
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  };
}

export interface FilterMessageDto {
  message: string;
  context?: string;
  filterConfig?: OpenAIFilterConfig;
}

export interface ChatResponseDto {
  userMessage: string;
  chatHistory?: ChatMessage[];
  systemPrompt?: string;
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  };
}

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('generate')
  async generateResponse(
    @Body() dto: GenerateResponseDto,
  ): Promise<ChatResponse> {
    try {
      return await this.openaiService.generateResponseWithRetry(
        dto.messages,
        dto.options,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Failed to generate response: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('filter')
  async filterMessage(@Body() dto: FilterMessageDto): Promise<{
    isAppropriate: boolean;
    reason?: string;
    confidence: number;
  }> {
    try {
      return await this.openaiService.filterMessage(
        dto.message,
        dto.context,
        dto.filterConfig,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Failed to filter message: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('chat')
  async generateChatResponse(
    @Body() dto: ChatResponseDto,
  ): Promise<ChatResponse> {
    try {
      return await this.openaiService.generateChatResponse(
        dto.userMessage,
        dto.chatHistory || [],
        dto.systemPrompt,
        dto.options,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Failed to generate chat response: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck(): Promise<{
    status: string;
    ready: boolean;
    apiKeyValid: boolean;
    config: any;
  }> {
    try {
      const ready = this.openaiService.isReady();
      const apiKeyValid = ready
        ? await this.openaiService.validateApiKey()
        : false;
      const config = this.openaiService.getConfig();

      return {
        status: ready && apiKeyValid ? 'healthy' : 'unhealthy',
        ready,
        apiKeyValid,
        config: {
          model: config.model,
          maxTokens: config.maxTokens,
          temperature: config.temperature,
          maxRetries: config.maxRetries,
          rateLimitPerMinute: config.rateLimitPerMinute,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Health check failed: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('config')
  getConfig(): any {
    try {
      return this.openaiService.getConfig();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Failed to get config: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test')
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    response?: string;
  }> {
    try {
      const testMessages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Hello, OpenAI service is working!"' },
      ];

      const response = await this.openaiService.generateResponseWithRetry(
        testMessages,
        { maxTokens: 50, temperature: 0.1 },
      );

      return {
        success: true,
        message: 'OpenAI service is working correctly',
        response: response.content,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `OpenAI service test failed: ${errorMessage}`,
      };
    }
  }
}
