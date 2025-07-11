import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { EscalationService } from '../services/escalation.service';
import {
  EscalationTrigger,
  EscalationPriority,
} from '../entities/escalation-rule.entity';
import { EscalationStatus } from '../entities/escalation-event.entity';
import { MessageStorageService } from '../services/message-storage.service';

export interface CreateEscalationRuleDto {
  streamerId: string;
  name: string;
  description?: string;
  triggerType: EscalationTrigger;
  priority: EscalationPriority;
  triggerConfig?: {
    keywords?: string[];
    patterns?: string[];
    frequencyThreshold?: number;
    userImportanceLevel?: string;
    sentimentThreshold?: number;
    customConditions?: Record<string, any>;
  };
  actionConfig?: {
    notifyStreamer: boolean;
    sendToDashboard: boolean;
    createAlert: boolean;
    autoResponse?: string;
    cooldownPeriod?: number;
    maxEscalationsPerHour?: number;
  };
  conditions?: {
    streamContext?: string[];
    timeOfDay?: {
      start: string;
      end: string;
    };
    userRoles?: string[];
    messageLength?: {
      min: number;
      max: number;
    };
  };
}

export interface UpdateEscalationRuleDto {
  name?: string;
  description?: string;
  triggerType?: EscalationTrigger;
  priority?: EscalationPriority;
  triggerConfig?: Record<string, any>;
  actionConfig?: Partial<{
    notifyStreamer: boolean;
    sendToDashboard: boolean;
    createAlert: boolean;
    autoResponse?: string;
    cooldownPeriod?: number;
    maxEscalationsPerHour?: number;
  }>;
  conditions?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateEscalationEventDto {
  status?: EscalationStatus;
  streamerNote?: string;
  resolutionData?: {
    resolvedBy?: string;
    resolutionNote?: string;
    actionTaken?: string;
  };
}

@Controller('escalation')
export class EscalationController {
  constructor(
    private readonly escalationService: EscalationService,
    private readonly messageStorageService: MessageStorageService,
  ) {}

  @Post('rules')
  async createEscalationRule(@Body() ruleData: CreateEscalationRuleDto) {
    try {
      const rule = await this.escalationService.createEscalationRule(ruleData);
      return {
        success: true,
        data: rule,
        message: 'Escalation rule created successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create escalation rule',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('rules/:streamerId')
  async getEscalationRules(@Param('streamerId') streamerId: string) {
    try {
      const rules = await this.escalationService.getEscalationRules(streamerId);
      return {
        success: true,
        data: rules,
        message: 'Escalation rules retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get escalation rules',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('rules/:ruleId')
  async updateEscalationRule(
    @Param('ruleId') ruleId: string,
    @Body() updates: UpdateEscalationRuleDto,
  ) {
    try {
      // Convert partial actionConfig to full object if provided
      const processedUpdates = { ...updates };
      if (updates.actionConfig) {
        processedUpdates.actionConfig = {
          notifyStreamer: updates.actionConfig.notifyStreamer ?? false,
          sendToDashboard: updates.actionConfig.sendToDashboard ?? false,
          createAlert: updates.actionConfig.createAlert ?? false,
          autoResponse: updates.actionConfig.autoResponse,
          cooldownPeriod: updates.actionConfig.cooldownPeriod,
          maxEscalationsPerHour: updates.actionConfig.maxEscalationsPerHour,
        };
      }

      const rule = await this.escalationService.updateEscalationRule(
        ruleId,
        processedUpdates as any,
      );
      if (!rule) {
        throw new HttpException(
          {
            success: false,
            message: 'Escalation rule not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: rule,
        message: 'Escalation rule updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update escalation rule',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('rules/:ruleId')
  async deleteEscalationRule(@Param('ruleId') ruleId: string) {
    try {
      const deleted = await this.escalationService.deleteEscalationRule(ruleId);
      if (!deleted) {
        throw new HttpException(
          {
            success: false,
            message: 'Escalation rule not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Escalation rule deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete escalation rule',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('events/:streamerId')
  async getEscalationEvents(
    @Param('streamerId') streamerId: string,
    @Query('status') status?: EscalationStatus,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const events = await this.escalationService.getEscalationEvents(
        streamerId,
        status,
        limit ? parseInt(limit) : 50,
        offset ? parseInt(offset) : 0,
      );

      return {
        success: true,
        data: events,
        message: 'Escalation events retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get escalation events',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('events/:eventId')
  async updateEscalationEvent(
    @Param('eventId') eventId: string,
    @Body() updates: UpdateEscalationEventDto,
  ) {
    try {
      const event = await this.escalationService.updateEscalationEvent(
        eventId,
        updates,
      );
      if (!event) {
        throw new HttpException(
          {
            success: false,
            message: 'Escalation event not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: event,
        message: 'Escalation event updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update escalation event',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/:streamerId')
  async getEscalationStats(@Param('streamerId') streamerId: string) {
    try {
      const stats = await this.escalationService.getEscalationStats(streamerId);
      return {
        success: true,
        data: stats,
        message: 'Escalation stats retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get escalation stats',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test')
  async testEscalation(
    @Body()
    testData: {
      streamerId: string;
      messageContent: string;
      streamId: string;
      userId: string;
      userName: string;
      userImportance?: number;
      streamContext?: string;
    },
  ) {
    try {
      // Create a mock message for testing
      const mockMessage = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        content: testData.messageContent,
        authorId: testData.userId,
        authorName: testData.userName,
        authorAvatar: '',
        platformMessageId: 'test-platform-id',
        streamId: testData.streamId,
        metadata: {
          isModerator: false,
          isSubscriber: false,
          badges: [],
          emotes: [],
          timestamp: new Date(),
        },
        processingStatus: 'pending' as const,
        analysis: {
          isQuestion: false,
          questionType: undefined,
          sentiment: 'neutral' as const,
          priority: 'low' as const,
          keywords: [],
        },
        requiresResponse: true,
        isEscalated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        stream: undefined as any,
        response: undefined as any,
      };

      // Insert the mock message into the database
      await this.messageStorageService['messageRepository'].save(mockMessage);

      const context = {
        message: mockMessage,
        streamerId: testData.streamerId,
        streamId: testData.streamId,
        chatHistory: [],
        userImportance: testData.userImportance || 0.5,
        streamContext: testData.streamContext || 'general',
        currentTime: new Date(),
      };

      const result = await this.escalationService.checkForEscalation(context);
      return {
        success: true,
        data: result,
        message: 'Escalation test completed',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to test escalation',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
