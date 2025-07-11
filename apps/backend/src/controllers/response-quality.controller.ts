import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ResponseQualityService,
  FeedbackData,
} from '../services/response-quality.service';
import {
  ResponseFeedback,
  FeedbackType,
  FeedbackReason,
} from '../entities/response-feedback.entity';

@Controller('response-quality')
export class ResponseQualityController {
  private readonly logger = new Logger(ResponseQualityController.name);

  constructor(
    private readonly responseQualityService: ResponseQualityService,
  ) {}

  @Post('feedback')
  async submitFeedback(
    @Body() feedbackData: FeedbackData,
  ): Promise<ResponseFeedback> {
    try {
      const feedback =
        await this.responseQualityService.submitFeedback(feedbackData);
      this.logger.log(
        `Feedback submitted for response ${feedbackData.responseId}`,
      );
      return feedback;
    } catch (error) {
      this.logger.error('Error submitting feedback:', error);
      throw new HttpException(
        'Failed to submit feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('metrics/:streamerId')
  async getQualityMetrics(
    @Param('streamerId') streamerId: string,
    @Query('start') startDate?: string,
    @Query('end') endDate?: string,
  ) {
    try {
      const timeRange =
        startDate && endDate
          ? { start: new Date(startDate), end: new Date(endDate) }
          : undefined;

      const metrics = await this.responseQualityService.getQualityMetrics(
        streamerId,
        timeRange,
      );
      return {
        streamerId,
        metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting quality metrics:', error);
      throw new HttpException(
        'Failed to get quality metrics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('insights/:streamerId')
  async getLearningInsights(@Param('streamerId') streamerId: string) {
    try {
      const insights =
        await this.responseQualityService.getLearningInsights(streamerId);
      return {
        streamerId,
        insights,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting learning insights:', error);
      throw new HttpException(
        'Failed to get learning insights',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('apply-insights/:streamerId')
  async applyLearningInsights(@Param('streamerId') streamerId: string) {
    try {
      const insights =
        await this.responseQualityService.getLearningInsights(streamerId);
      await this.responseQualityService.updateStreamerProfileFromFeedback(
        streamerId,
        insights,
      );

      return {
        streamerId,
        message: 'Learning insights applied successfully',
        appliedChanges: insights.recommendedChanges.filter(
          (change) => change.priority === 'high',
        ),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error applying learning insights:', error);
      throw new HttpException(
        'Failed to apply learning insights',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history/:streamerId')
  async getFeedbackHistory(
    @Param('streamerId') streamerId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const feedbackHistory =
        await this.responseQualityService.getFeedbackHistory(
          streamerId,
          limit ? parseInt(limit, 10) : 50,
          offset ? parseInt(offset, 10) : 0,
        );

      return {
        streamerId,
        feedbackHistory,
        total: feedbackHistory.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting feedback history:', error);
      throw new HttpException(
        'Failed to get feedback history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('feedback-types')
  getFeedbackTypes() {
    return {
      feedbackTypes: Object.values(FeedbackType),
      feedbackReasons: Object.values(FeedbackReason),
    };
  }

  @Get('analytics/:streamerId')
  async getAnalytics(@Param('streamerId') streamerId: string) {
    try {
      const [metrics, insights, history] = await Promise.all([
        this.responseQualityService.getQualityMetrics(streamerId),
        this.responseQualityService.getLearningInsights(streamerId),
        this.responseQualityService.getFeedbackHistory(streamerId, 10),
      ]);

      return {
        streamerId,
        analytics: {
          metrics,
          insights,
          recentFeedback: history,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting analytics:', error);
      throw new HttpException(
        'Failed to get analytics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
