import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { StreamerProfileService } from '../services/streamer-profile.service';
import { StreamerProfile } from '../entities/streamer-profile.entity';

@Controller('streamer-profiles')
export class StreamerProfileController {
  private readonly logger = new Logger(StreamerProfileController.name);

  constructor(
    private readonly streamerProfileService: StreamerProfileService,
  ) {}

  @Get(':streamerId')
  async getStreamerProfile(
    @Param('streamerId') streamerId: string,
  ): Promise<StreamerProfile | null> {
    try {
      const profile =
        await this.streamerProfileService.getStreamerProfile(streamerId);
      return profile;
    } catch (error) {
      this.logger.error(
        'Error getting streamer profile:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to get streamer profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createStreamerProfile(
    @Body()
    profileData: {
      streamerId: string;
      streamerName: string;
      personality?: StreamerProfile['personality'];
      aiPreferences?: StreamerProfile['aiPreferences'];
      contextSettings?: StreamerProfile['contextSettings'];
      customPrompts?: StreamerProfile['customPrompts'];
    },
  ): Promise<StreamerProfile> {
    try {
      const profile =
        await this.streamerProfileService.createStreamerProfile(profileData);
      return profile;
    } catch (error) {
      this.logger.error(
        'Error creating streamer profile:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to create streamer profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':streamerId')
  async updateStreamerProfile(
    @Param('streamerId') streamerId: string,
    @Body() updates: Partial<StreamerProfile>,
  ): Promise<StreamerProfile | null> {
    try {
      const profile = await this.streamerProfileService.updateStreamerProfile(
        streamerId,
        updates,
      );
      return profile;
    } catch (error) {
      this.logger.error(
        'Error updating streamer profile:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to update streamer profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':streamerId/test-personalization')
  async testPersonalization(
    @Param('streamerId') streamerId: string,
    @Body()
    testData: {
      messageContent: string;
      chatHistory: Array<{
        authorId: string;
        content: string;
        timestamp: Date;
      }>;
    },
  ): Promise<{ systemPrompt: string; messageType: string }> {
    try {
      const personalizationContext = {
        streamerId,
        streamId: 'test-stream',
        messageType: this.determineMessageType(testData.messageContent),
        chatHistory: testData.chatHistory,
      };

      const systemPrompt =
        await this.streamerProfileService.generatePersonalizedSystemPrompt(
          personalizationContext,
        );

      return {
        systemPrompt,
        messageType: personalizationContext.messageType,
      };
    } catch (error) {
      this.logger.error(
        'Error testing personalization:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to test personalization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
}
