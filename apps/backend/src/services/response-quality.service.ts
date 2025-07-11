import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ResponseFeedback,
  FeedbackType,
  FeedbackReason,
} from '../entities/response-feedback.entity';
import { Response } from '../entities/response.entity';
import { StreamerProfile } from '../entities/streamer-profile.entity';

export interface FeedbackData {
  responseId: string;
  streamerId: string;
  streamId: string;
  userId?: string;
  feedbackType: FeedbackType;
  feedbackReason?: FeedbackReason;
  userComment?: string;
  rating?: number;
  context?: {
    originalMessage: string;
    aiResponse: string;
    chatHistory: string[];
    streamContext: string;
    userInteractions: number;
  };
}

export interface QualityMetrics {
  averageRating: number;
  positiveFeedbackRate: number;
  negativeFeedbackRate: number;
  totalFeedback: number;
  topReasons: Array<{ reason: FeedbackReason; count: number }>;
  improvementAreas: string[];
  responseEffectiveness: number;
}

export interface LearningInsights {
  responsePatterns: Array<{
    pattern: string;
    successRate: number;
    usageCount: number;
  }>;
  userPreferences: Array<{
    preference: string;
    frequency: number;
    effectiveness: number;
  }>;
  improvementSuggestions: string[];
  recommendedChanges: Array<{
    type: 'personality' | 'response_style' | 'content_focus';
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

@Injectable()
export class ResponseQualityService {
  private readonly logger = new Logger(ResponseQualityService.name);

  constructor(
    @InjectRepository(ResponseFeedback)
    private readonly feedbackRepository: Repository<ResponseFeedback>,
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    @InjectRepository(StreamerProfile)
    private readonly streamerProfileRepository: Repository<StreamerProfile>,
  ) {}

  async submitFeedback(feedbackData: FeedbackData): Promise<ResponseFeedback> {
    try {
      const feedback = this.feedbackRepository.create({
        ...feedbackData,
        rating:
          feedbackData.rating ||
          this.getDefaultRating(feedbackData.feedbackType),
      });

      const savedFeedback = await this.feedbackRepository.save(feedback);
      this.logger.log(
        `Feedback submitted for response ${feedbackData.responseId}`,
      );

      // Process feedback for learning
      await this.processFeedbackForLearning(savedFeedback);

      return savedFeedback;
    } catch (error) {
      this.logger.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  async getQualityMetrics(
    streamerId: string,
    timeRange?: { start: Date; end: Date },
  ): Promise<QualityMetrics> {
    try {
      const query = this.feedbackRepository
        .createQueryBuilder('feedback')
        .where('feedback.streamerId = :streamerId', { streamerId });

      if (timeRange) {
        query.andWhere('feedback.createdAt BETWEEN :start AND :end', timeRange);
      }

      const feedbacks = await query.getMany();

      const totalFeedback = feedbacks.length;
      const positiveFeedback = feedbacks.filter(
        (f) => f.feedbackType === FeedbackType.POSITIVE,
      ).length;
      const negativeFeedback = feedbacks.filter(
        (f) => f.feedbackType === FeedbackType.NEGATIVE,
      ).length;
      // const neutralFeedback = feedbacks.filter(
      //   (f) => f.feedbackType === FeedbackType.NEUTRAL,
      // ).length;

      const averageRating =
        totalFeedback > 0
          ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
          : 0;

      const positiveFeedbackRate =
        totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0;
      const negativeFeedbackRate =
        totalFeedback > 0 ? (negativeFeedback / totalFeedback) * 100 : 0;

      // Calculate top reasons
      const reasonCounts = new Map<FeedbackReason, number>();
      feedbacks.forEach((feedback) => {
        if (feedback.feedbackReason) {
          reasonCounts.set(
            feedback.feedbackReason,
            (reasonCounts.get(feedback.feedbackReason) || 0) + 1,
          );
        }
      });

      const topReasons = Array.from(reasonCounts.entries())
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Identify improvement areas
      const improvementAreas = this.identifyImprovementAreas(feedbacks);

      // Calculate response effectiveness
      const responseEffectiveness =
        this.calculateResponseEffectiveness(feedbacks);

      return {
        averageRating,
        positiveFeedbackRate,
        negativeFeedbackRate,
        totalFeedback,
        topReasons,
        improvementAreas,
        responseEffectiveness,
      };
    } catch (error) {
      this.logger.error('Failed to get quality metrics:', error);
      throw error;
    }
  }

  async getLearningInsights(streamerId: string): Promise<LearningInsights> {
    try {
      const feedbacks = await this.feedbackRepository.find({
        where: { streamerId },
        order: { createdAt: 'DESC' },
        take: 100, // Last 100 feedback entries
      });

      const responsePatterns = this.analyzeResponsePatterns(feedbacks);
      const userPreferences = this.analyzeUserPreferences(feedbacks);
      const improvementSuggestions =
        this.generateImprovementSuggestions(feedbacks);
      const recommendedChanges = this.generateRecommendedChanges(feedbacks);

      return {
        responsePatterns,
        userPreferences,
        improvementSuggestions,
        recommendedChanges,
      };
    } catch (error) {
      this.logger.error('Failed to get learning insights:', error);
      throw error;
    }
  }

  async updateStreamerProfileFromFeedback(
    streamerId: string,
    insights: LearningInsights,
  ): Promise<void> {
    try {
      const profile = await this.streamerProfileRepository.findOne({
        where: { streamerId },
      });

      if (!profile) {
        this.logger.warn(`No streamer profile found for ${streamerId}`);
        return;
      }

      // Apply high-priority recommendations
      const highPriorityChanges = insights.recommendedChanges.filter(
        (change) => change.priority === 'high',
      );

      for (const change of highPriorityChanges) {
        this.applyProfileChange(profile, change);
      }

      await this.streamerProfileRepository.save(profile);
      this.logger.log(
        `Updated streamer profile for ${streamerId} based on feedback insights`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to update streamer profile from feedback:',
        error,
      );
      throw error;
    }
  }

  async getFeedbackHistory(
    streamerId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ResponseFeedback[]> {
    try {
      return await this.feedbackRepository.find({
        where: { streamerId },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
      });
    } catch (error) {
      this.logger.error('Failed to get feedback history:', error);
      throw error;
    }
  }

  private getDefaultRating(feedbackType: FeedbackType): number {
    switch (feedbackType) {
      case FeedbackType.POSITIVE:
        return 4;
      case FeedbackType.NEGATIVE:
        return 2;
      case FeedbackType.NEUTRAL:
        return 3;
      default:
        return 3;
    }
  }

  private async processFeedbackForLearning(
    feedback: ResponseFeedback,
  ): Promise<void> {
    try {
      // Analyze response patterns
      const responsePattern = this.extractResponsePattern(
        feedback.context?.aiResponse,
      );
      const userPreference = this.extractUserPreference(feedback);
      const improvementSuggestion =
        this.generateImprovementSuggestion(feedback);

      // Find similar responses
      const similarResponses = await this.findSimilarResponses(feedback);

      // Update learning data
      feedback.learningData = {
        responsePattern,
        userPreference,
        improvementSuggestion,
        similarResponses,
      };

      feedback.isProcessed = true;
      feedback.processedAt = new Date();

      await this.feedbackRepository.save(feedback);
      this.logger.log(`Processed feedback ${feedback.id} for learning`);
    } catch (error) {
      this.logger.error('Failed to process feedback for learning:', error);
    }
  }

  private extractResponsePattern(response: string): string {
    if (!response) return '';

    // Simple pattern extraction - can be enhanced with NLP
    const patterns: string[] = [];

    if (response.includes('?')) patterns.push('question');
    if (response.includes('!')) patterns.push('exclamation');
    if (response.includes('😊') || response.includes('😄'))
      patterns.push('emoji_positive');
    if (response.includes('😔') || response.includes('😞'))
      patterns.push('emoji_negative');
    if (response.length < 50) patterns.push('short');
    if (response.length > 100) patterns.push('long');
    if (response.includes('terima kasih') || response.includes('thanks'))
      patterns.push('gratitude');
    if (response.includes('selamat') || response.includes('welcome'))
      patterns.push('greeting');

    return patterns.join('_') || 'neutral';
  }

  private extractUserPreference(feedback: ResponseFeedback): string {
    if (feedback.feedbackReason === FeedbackReason.HELPFUL)
      return 'helpful_responses';
    if (feedback.feedbackReason === FeedbackReason.ENGAGING)
      return 'engaging_content';
    if (feedback.feedbackReason === FeedbackReason.ACCURATE)
      return 'accurate_info';
    if (feedback.feedbackReason === FeedbackReason.RELEVANT)
      return 'relevant_topics';
    if (feedback.feedbackReason === FeedbackReason.REPETITIVE)
      return 'varied_responses';
    if (feedback.feedbackReason === FeedbackReason.BORING)
      return 'entertaining_content';

    return 'general';
  }

  private generateImprovementSuggestion(feedback: ResponseFeedback): string {
    if (feedback.feedbackType === FeedbackType.POSITIVE) {
      return 'Continue this response style';
    }

    switch (feedback.feedbackReason) {
      case FeedbackReason.REPETITIVE:
        return 'Vary response patterns and vocabulary';
      case FeedbackReason.BORING:
        return 'Add more engaging and entertaining elements';
      case FeedbackReason.IRRELEVANT:
        return 'Focus on more relevant topics and context';
      case FeedbackReason.INACCURATE:
        return 'Improve accuracy and fact-checking';
      case FeedbackReason.INAPPROPRIATE:
        return 'Review content appropriateness and tone';
      default:
        return 'Consider user feedback for improvement';
    }
  }

  private async findSimilarResponses(
    feedback: ResponseFeedback,
  ): Promise<string[]> {
    try {
      const similarResponses = await this.responseRepository
        .createQueryBuilder('response')
        .where('response.streamerId = :streamerId', {
          streamerId: feedback.streamerId,
        })
        .andWhere('response.content ILIKE :pattern', {
          pattern: `%${feedback.context?.aiResponse?.substring(0, 20)}%`,
        })
        .orderBy('response.createdAt', 'DESC')
        .limit(5)
        .getMany();

      return similarResponses.map((r) => r.content);
    } catch (error) {
      this.logger.error('Failed to find similar responses:', error);
      return [];
    }
  }

  private identifyImprovementAreas(feedbacks: ResponseFeedback[]): string[] {
    const areas = new Set<string>();

    feedbacks.forEach((feedback) => {
      if (feedback.feedbackType === FeedbackType.NEGATIVE) {
        switch (feedback.feedbackReason) {
          case FeedbackReason.REPETITIVE:
            areas.add('response_variety');
            break;
          case FeedbackReason.BORING:
            areas.add('engagement');
            break;
          case FeedbackReason.IRRELEVANT:
            areas.add('relevance');
            break;
          case FeedbackReason.INACCURATE:
            areas.add('accuracy');
            break;
          case FeedbackReason.INAPPROPRIATE:
            areas.add('appropriateness');
            break;
        }
      }
    });

    return Array.from(areas);
  }

  private calculateResponseEffectiveness(
    feedbacks: ResponseFeedback[],
  ): number {
    if (feedbacks.length === 0) return 0;

    const totalScore = feedbacks.reduce((score, feedback) => {
      let feedbackScore = 0;

      if (feedback.feedbackType === FeedbackType.POSITIVE) {
        feedbackScore = feedback.rating;
      } else if (feedback.feedbackType === FeedbackType.NEGATIVE) {
        feedbackScore = 6 - feedback.rating; // Invert negative ratings
      } else {
        feedbackScore = feedback.rating;
      }

      return score + feedbackScore;
    }, 0);

    return (totalScore / feedbacks.length / 5) * 100; // Convert to percentage
  }

  private analyzeResponsePatterns(feedbacks: ResponseFeedback[]): Array<{
    pattern: string;
    successRate: number;
    usageCount: number;
  }> {
    const patternStats = new Map<string, { positive: number; total: number }>();

    feedbacks.forEach((feedback) => {
      if (feedback.learningData?.responsePattern) {
        const pattern = feedback.learningData.responsePattern;
        const current = patternStats.get(pattern) || { positive: 0, total: 0 };

        current.total++;
        if (feedback.feedbackType === FeedbackType.POSITIVE) {
          current.positive++;
        }

        patternStats.set(pattern, current);
      }
    });

    return Array.from(patternStats.entries())
      .map(([pattern, stats]) => ({
        pattern,
        successRate: stats.total > 0 ? (stats.positive / stats.total) * 100 : 0,
        usageCount: stats.total,
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }

  private analyzeUserPreferences(feedbacks: ResponseFeedback[]): Array<{
    preference: string;
    frequency: number;
    effectiveness: number;
  }> {
    const preferenceStats = new Map<
      string,
      { positive: number; total: number }
    >();

    feedbacks.forEach((feedback) => {
      if (feedback.learningData?.userPreference) {
        const preference = feedback.learningData.userPreference;
        const current = preferenceStats.get(preference) || {
          positive: 0,
          total: 0,
        };

        current.total++;
        if (feedback.feedbackType === FeedbackType.POSITIVE) {
          current.positive++;
        }

        preferenceStats.set(preference, current);
      }
    });

    return Array.from(preferenceStats.entries())
      .map(([preference, stats]) => ({
        preference,
        frequency: stats.total,
        effectiveness:
          stats.total > 0 ? (stats.positive / stats.total) * 100 : 0,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  private generateImprovementSuggestions(
    feedbacks: ResponseFeedback[],
  ): string[] {
    const suggestions = new Set<string>();

    feedbacks.forEach((feedback) => {
      if (feedback.learningData?.improvementSuggestion) {
        suggestions.add(feedback.learningData.improvementSuggestion);
      }
    });

    return Array.from(suggestions);
  }

  private generateRecommendedChanges(feedbacks: ResponseFeedback[]): Array<{
    type: 'personality' | 'response_style' | 'content_focus';
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const changes: Array<{
      type: 'personality' | 'response_style' | 'content_focus';
      suggestion: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    const negativeFeedbacks = feedbacks.filter(
      (f) => f.feedbackType === FeedbackType.NEGATIVE,
    );
    const negativeCount = negativeFeedbacks.length;
    const totalCount = feedbacks.length;
    const negativeRate = totalCount > 0 ? negativeCount / totalCount : 0;

    if (negativeRate > 0.3) {
      changes.push({
        type: 'response_style',
        suggestion:
          'High negative feedback rate detected. Consider adjusting response tone and style.',
        priority: 'high',
      });
    }

    const repetitiveCount = negativeFeedbacks.filter(
      (f) => f.feedbackReason === FeedbackReason.REPETITIVE,
    ).length;

    if (repetitiveCount > negativeCount * 0.4) {
      changes.push({
        type: 'response_style',
        suggestion:
          'Many users find responses repetitive. Increase response variety.',
        priority: 'high',
      });
    }

    const boringCount = negativeFeedbacks.filter(
      (f) => f.feedbackReason === FeedbackReason.BORING,
    ).length;

    if (boringCount > negativeCount * 0.3) {
      changes.push({
        type: 'personality',
        suggestion:
          'Responses perceived as boring. Add more engaging and entertaining elements.',
        priority: 'medium',
      });
    }

    return changes;
  }

  private applyProfileChange(
    profile: StreamerProfile,
    change: { type: string; suggestion: string; priority: string },
  ): void {
    switch (change.type) {
      case 'personality':
        if (change.suggestion.includes('engaging')) {
          profile.personality.humorLevel = 'moderate';
          profile.personality.emojiUsage = 'moderate';
        }
        break;
      case 'response_style':
        if (change.suggestion.includes('variety')) {
          profile.aiPreferences.commonPhrases = [
            ...profile.aiPreferences.commonPhrases,
            'wow',
            'amazing',
            'incredible',
            'fantastic',
          ];
        }
        break;
      case 'content_focus':
        // Apply content focus changes
        break;
    }
  }
}
