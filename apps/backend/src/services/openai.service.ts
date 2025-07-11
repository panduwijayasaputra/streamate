import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  maxRetries: number;
  retryDelay: number;
  rateLimitPerMinute: number;
  timeout: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
}

export interface OpenAIFilterConfig {
  enabled: boolean;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;
  private config: OpenAIConfig;
  private rateLimitCounter = 0;
  private lastRateLimitReset = Date.now();
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {
    this.initializeOpenAI();
  }

  private initializeOpenAI(): void {
    const apiKey = this.configService.get<string>('api.openaiApiKey');

    if (!apiKey) {
      this.logger.warn('OpenAI API key not configured');
      return;
    }

    this.config = {
      apiKey,
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3', 10),
      retryDelay: parseInt(process.env.OPENAI_RETRY_DELAY || '1000', 10),
      rateLimitPerMinute: parseInt(
        process.env.OPENAI_RATE_LIMIT_PER_MINUTE || '60',
        10,
      ),
      timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000', 10),
    };

    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    });

    this.isInitialized = true;
    this.logger.log('OpenAI service initialized successfully');
  }

  async generateResponse(
    messages: ChatMessage[],
    options?: Partial<OpenAIConfig>,
  ): Promise<ChatResponse> {
    if (!this.isInitialized) {
      throw new Error('OpenAI service not initialized');
    }

    const mergedConfig = { ...this.config, ...options };

    try {
      await this.checkRateLimit();

      const response = await this.openai.chat.completions.create({
        model: mergedConfig.model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: mergedConfig.maxTokens,
        temperature: mergedConfig.temperature,
      });

      const completion = response.choices[0];
      if (!completion) {
        throw new Error('No completion received from OpenAI');
      }

      return {
        content: completion.message?.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        model: response.model,
        finishReason: completion.finish_reason || 'unknown',
      };
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw this.handleOpenAIError(error);
    }
  }

  async generateResponseWithRetry(
    messages: ChatMessage[],
    options?: Partial<OpenAIConfig>,
  ): Promise<ChatResponse> {
    const mergedConfig = { ...this.config, ...options };
    let lastError: Error;

    for (let attempt = 1; attempt <= mergedConfig.maxRetries; attempt++) {
      try {
        return await this.generateResponse(messages, options);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (this.shouldNotRetry(error)) {
          throw error;
        }

        if (attempt < mergedConfig.maxRetries) {
          const delay = this.calculateRetryDelay(
            attempt,
            mergedConfig.retryDelay,
          );
          this.logger.warn(
            `OpenAI API attempt ${attempt} failed, retrying in ${delay}ms: ${lastError.message}`,
          );
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  async filterMessage(
    message: string,
    context?: string,
    filterConfig?: OpenAIFilterConfig,
  ): Promise<{ isAppropriate: boolean; reason?: string; confidence: number }> {
    if (!filterConfig?.enabled) {
      return { isAppropriate: true, confidence: 1.0 };
    }

    const systemPrompt =
      filterConfig.systemPrompt ||
      'You are a content filter for live chat messages. Determine if a message is appropriate for a live stream. Consider: spam, inappropriate content, harassment, etc. Respond with JSON: {"isAppropriate": boolean, "reason": "string", "confidence": number}';

    const userPrompt = `Message: "${message}"${context ? `\nContext: ${context}` : ''}`;

    try {
      const response = await this.generateResponseWithRetry(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        {
          maxTokens: filterConfig.maxTokens || 100,
          temperature: filterConfig.temperature || 0.1,
        },
      );

      const result = this.parseFilterResponse(response.content);
      return result;
    } catch (error) {
      this.logger.error('Error filtering message:', error);
      // Default to allowing the message if filtering fails
      return { isAppropriate: true, confidence: 0.5 };
    }
  }

  async generateChatResponse(
    userMessage: string,
    chatHistory: ChatMessage[] = [],
    systemPrompt?: string,
    options?: Partial<OpenAIConfig>,
  ): Promise<ChatResponse> {
    const messages: ChatMessage[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    // Add chat history (limit to last 10 messages to avoid token limits)
    const recentHistory = chatHistory.slice(-10);
    messages.push(...recentHistory);

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    return this.generateResponseWithRetry(messages, options);
  }

  async validateApiKey(): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }

    try {
      await this.openai.models.list();
      return true;
    } catch (error) {
      this.logger.error('OpenAI API key validation failed:', error);
      return false;
    }
  }

  getConfig(): OpenAIConfig {
    return { ...this.config };
  }

  isReady(): boolean {
    return this.isInitialized && !!this.config.apiKey;
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();

    // Reset counter if a minute has passed
    if (now - this.lastRateLimitReset > 60000) {
      this.rateLimitCounter = 0;
      this.lastRateLimitReset = now;
    }

    // Check if we're at the rate limit
    if (this.rateLimitCounter >= this.config.rateLimitPerMinute) {
      const waitTime = 60000 - (now - this.lastRateLimitReset);
      this.logger.warn(`OpenAI rate limit reached, waiting ${waitTime}ms`);
      await this.sleep(waitTime);
      this.rateLimitCounter = 0;
      this.lastRateLimitReset = Date.now();
    }

    this.rateLimitCounter++;
  }

  private handleOpenAIError(error: unknown): Error {
    const errorObj = error as {
      status?: number;
      message?: string;
      code?: string;
    };

    if (errorObj?.status === 429) {
      return new Error('OpenAI rate limit exceeded');
    } else if (errorObj?.status === 401) {
      return new Error('OpenAI API key invalid');
    } else if (errorObj?.status === 400) {
      return new Error(
        `OpenAI request error: ${errorObj.message || 'Bad request'}`,
      );
    } else if (
      errorObj?.code === 'ECONNRESET' ||
      errorObj?.code === 'ETIMEDOUT'
    ) {
      return new Error('OpenAI connection timeout');
    } else {
      return new Error(
        `OpenAI API error: ${errorObj?.message || 'Unknown error'}`,
      );
    }
  }

  private shouldNotRetry(error: unknown): boolean {
    // Don't retry on authentication errors or invalid requests
    const errorObj = error as { status?: number };
    return errorObj?.status === 401 || errorObj?.status === 400;
  }

  private calculateRetryDelay(attempt: number, baseDelay: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
  }

  private parseFilterResponse(content: string): {
    isAppropriate: boolean;
    reason?: string;
    confidence: number;
  } {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(content) as {
        isAppropriate?: boolean;
        reason?: string;
        confidence?: number;
      };
      return {
        isAppropriate: parsed.isAppropriate ?? true,
        reason: parsed.reason,
        confidence: parsed.confidence ?? 0.5,
      };
    } catch {
      // If JSON parsing fails, try to extract information from text
      const lowerContent = content.toLowerCase();
      const isAppropriate =
        !lowerContent.includes('inappropriate') &&
        !lowerContent.includes('spam') &&
        !lowerContent.includes('block');

      return {
        isAppropriate,
        reason: 'Parsed from text response',
        confidence: 0.3,
      };
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
