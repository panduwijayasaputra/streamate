import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EscalationRule,
  EscalationTrigger,
  EscalationPriority,
} from '../entities/escalation-rule.entity';
import {
  EscalationEvent,
  EscalationStatus,
} from '../entities/escalation-event.entity';
import { Message } from '../entities/message.entity';

export interface EscalationContext {
  message: Message;
  streamerId: string;
  streamId: string;
  chatHistory: Message[];
  userImportance: number;
  streamContext: string;
  currentTime: Date;
}

export interface EscalationResult {
  shouldEscalate: boolean;
  rule?: EscalationRule;
  priority: EscalationPriority;
  reason: string;
  triggerData?: Record<string, any>;
}

export interface EscalationRuleData {
  streamerId: string;
  name: string;
  description?: string;
  triggerType: EscalationTrigger;
  priority: EscalationPriority;
  triggerConfig?: Record<string, any>;
  actionConfig?: Record<string, any>;
  conditions?: Record<string, any>;
}

@Injectable()
export class EscalationService {
  private readonly logger = new Logger(EscalationService.name);

  constructor(
    @InjectRepository(EscalationRule)
    private readonly escalationRuleRepository: Repository<EscalationRule>,
    @InjectRepository(EscalationEvent)
    private readonly escalationEventRepository: Repository<EscalationEvent>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createEscalationRule(
    ruleData: EscalationRuleData,
  ): Promise<EscalationRule> {
    try {
      const rule = this.escalationRuleRepository.create(ruleData);
      const savedRule = await this.escalationRuleRepository.save(rule);
      this.logger.log(
        `Created escalation rule: ${ruleData.name} for streamer ${ruleData.streamerId}`,
      );
      return savedRule;
    } catch (error) {
      this.logger.error('Failed to create escalation rule:', error);
      throw error;
    }
  }

  async getEscalationRules(streamerId: string): Promise<EscalationRule[]> {
    try {
      return await this.escalationRuleRepository.find({
        where: { streamerId, isActive: true },
        order: { priority: 'DESC', createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Failed to get escalation rules:', error);
      throw error;
    }
  }

  async updateEscalationRule(
    ruleId: string,
    updates: Partial<EscalationRule> & {
      actionConfig?: {
        notifyStreamer: boolean;
        sendToDashboard: boolean;
        createAlert: boolean;
        autoResponse?: string;
        cooldownPeriod?: number;
        maxEscalationsPerHour?: number;
      };
    },
  ): Promise<EscalationRule | null> {
    try {
      const rule = await this.escalationRuleRepository.findOne({
        where: { id: ruleId },
      });

      if (!rule) {
        return null;
      }

      Object.assign(rule, updates);
      const updatedRule = await this.escalationRuleRepository.save(rule);
      this.logger.log(`Updated escalation rule: ${rule.name}`);
      return updatedRule;
    } catch (error) {
      this.logger.error('Failed to update escalation rule:', error);
      throw error;
    }
  }

  async deleteEscalationRule(ruleId: string): Promise<boolean> {
    try {
      const result = await this.escalationRuleRepository.delete(ruleId);
      this.logger.log(`Deleted escalation rule: ${ruleId}`);
      return (result.affected || 0) > 0;
    } catch (error) {
      this.logger.error('Failed to delete escalation rule:', error);
      throw error;
    }
  }

  async checkForEscalation(
    context: EscalationContext,
  ): Promise<EscalationResult> {
    try {
      const rules = await this.getEscalationRules(context.streamerId);
      let highestPriority = EscalationPriority.LOW;
      let matchedRule: EscalationRule | undefined;
      let triggerData: Record<string, any> = {};

      for (const rule of rules) {
        const result = await this.evaluateRule(rule, context);
        if (
          result.shouldEscalate &&
          this.isHigherPriority(result.priority, highestPriority)
        ) {
          highestPriority = result.priority;
          matchedRule = rule;
          triggerData = result.triggerData || {};
        }
      }

      if (matchedRule) {
        // Check cooldown period
        const canTrigger = await this.checkCooldown(matchedRule);
        if (!canTrigger) {
          return {
            shouldEscalate: false,
            priority: highestPriority,
            reason: 'Cooldown period active',
          };
        }

        // Create escalation event
        await this.createEscalationEvent(matchedRule, context, triggerData);

        return {
          shouldEscalate: true,
          rule: matchedRule,
          priority: highestPriority,
          reason: `Matched rule: ${matchedRule.name}`,
          triggerData,
        };
      }

      return {
        shouldEscalate: false,
        priority: highestPriority,
        reason: 'No matching rules',
      };
    } catch (error) {
      this.logger.error('Failed to check for escalation:', error);
      throw error;
    }
  }

  private async evaluateRule(
    rule: EscalationRule,
    context: EscalationContext,
  ): Promise<EscalationResult> {
    try {
      // Check conditions first
      if (!this.evaluateConditions(rule.conditions, context)) {
        return {
          shouldEscalate: false,
          priority: rule.priority,
          reason: 'Conditions not met',
        };
      }

      let shouldEscalate = false;
      let triggerData: Record<string, any> = {};

      switch (rule.triggerType) {
        case EscalationTrigger.KEYWORD_MATCH:
          const keywordResult = this.checkKeywordMatch(
            rule.triggerConfig,
            context.message.content,
          );
          shouldEscalate = keywordResult.matched;
          triggerData = { matchedKeywords: keywordResult.keywords };
          break;

        case EscalationTrigger.PATTERN_MATCH:
          const patternResult = this.checkPatternMatch(
            rule.triggerConfig,
            context.message.content,
          );
          shouldEscalate = patternResult.matched;
          triggerData = { matchedPatterns: patternResult.patterns };
          break;

        case EscalationTrigger.FREQUENCY_THRESHOLD:
          const frequencyResult = await this.checkFrequencyThreshold(
            rule.triggerConfig,
            context,
          );
          shouldEscalate = frequencyResult.matched;
          triggerData = { frequencyCount: frequencyResult.count };
          break;

        case EscalationTrigger.USER_IMPORTANCE:
          const importanceResult = this.checkUserImportance(
            rule.triggerConfig,
            context.userImportance,
          );
          shouldEscalate = importanceResult.matched;
          triggerData = { userImportance: context.userImportance };
          break;

        case EscalationTrigger.CONTENT_SENTIMENT:
          const sentimentResult = this.checkContentSentiment(
            rule.triggerConfig,
            context.message.content,
          );
          shouldEscalate = sentimentResult.matched;
          triggerData = { sentimentScore: sentimentResult.score };
          break;

        case EscalationTrigger.CUSTOM_RULE:
          const customResult = await this.evaluateCustomRule(
            rule.triggerConfig,
            context,
          );
          shouldEscalate = customResult.matched;
          triggerData = customResult.data;
          break;
      }

      return {
        shouldEscalate,
        rule,
        priority: rule.priority,
        reason: shouldEscalate
          ? `Triggered by ${rule.triggerType}`
          : 'No trigger match',
        triggerData,
      };
    } catch (error) {
      this.logger.error('Failed to evaluate rule:', error);
      return {
        shouldEscalate: false,
        priority: rule.priority,
        reason: 'Evaluation error',
      };
    }
  }

  private evaluateConditions(
    conditions: EscalationRule['conditions'],
    context: EscalationContext,
  ): boolean {
    if (!conditions) return true;

    // Check stream context
    if (conditions.streamContext && conditions.streamContext.length > 0) {
      if (!conditions.streamContext.includes(context.streamContext)) {
        return false;
      }
    }

    // Check time of day
    if (conditions.timeOfDay) {
      const currentHour = context.currentTime.getHours();
      const startHour = parseInt(conditions.timeOfDay.start.split(':')[0]);
      const endHour = parseInt(conditions.timeOfDay.end.split(':')[0]);

      if (startHour <= endHour) {
        if (currentHour < startHour || currentHour > endHour) {
          return false;
        }
      } else {
        // Crosses midnight
        if (currentHour < startHour && currentHour > endHour) {
          return false;
        }
      }
    }

    // Check message length
    if (conditions.messageLength) {
      const messageLength = context.message.content.length;
      if (
        messageLength < conditions.messageLength.min ||
        messageLength > conditions.messageLength.max
      ) {
        return false;
      }
    }

    return true;
  }

  private checkKeywordMatch(
    config: EscalationRule['triggerConfig'],
    content: string,
  ): { matched: boolean; keywords: string[] } {
    if (!config?.keywords || config.keywords.length === 0) {
      return { matched: false, keywords: [] };
    }

    const matchedKeywords = config.keywords.filter((keyword) =>
      content.toLowerCase().includes(keyword.toLowerCase()),
    );

    return {
      matched: matchedKeywords.length > 0,
      keywords: matchedKeywords,
    };
  }

  private checkPatternMatch(
    config: EscalationRule['triggerConfig'],
    content: string,
  ): { matched: boolean; patterns: string[] } {
    if (!config?.patterns || config.patterns.length === 0) {
      return { matched: false, patterns: [] };
    }

    const matchedPatterns = config.patterns.filter((pattern) => {
      try {
        const regex = new RegExp(pattern, 'i');
        return regex.test(content);
      } catch (error) {
        this.logger.warn(`Invalid regex pattern: ${pattern}`);
        return false;
      }
    });

    return {
      matched: matchedPatterns.length > 0,
      patterns: matchedPatterns,
    };
  }

  private async checkFrequencyThreshold(
    config: EscalationRule['triggerConfig'],
    context: EscalationContext,
  ): Promise<{ matched: boolean; count: number }> {
    if (!config?.frequencyThreshold) {
      return { matched: false, count: 0 };
    }

    const timeWindow = new Date(context.currentTime.getTime() - 60 * 60 * 1000); // 1 hour

    const similarMessages = await this.messageRepository.count({
      where: {
        streamId: context.streamId,
        content: context.message.content,
        createdAt: { $gte: timeWindow } as any,
      },
    });

    return {
      matched: similarMessages >= config.frequencyThreshold,
      count: similarMessages,
    };
  }

  private checkUserImportance(
    config: EscalationRule['triggerConfig'],
    userImportance: number,
  ): { matched: boolean } {
    if (!config?.userImportanceLevel) {
      return { matched: false };
    }

    const thresholds = {
      low: 0.3,
      medium: 0.6,
      high: 0.8,
    };

    const threshold =
      thresholds[config.userImportanceLevel as keyof typeof thresholds];
    return {
      matched: userImportance >= threshold,
    };
  }

  private checkContentSentiment(
    config: EscalationRule['triggerConfig'],
    content: string,
  ): { matched: boolean; score: number } {
    if (!config?.sentimentThreshold) {
      return { matched: false, score: 0 };
    }

    // Simple sentiment analysis (can be enhanced with NLP)
    const positiveWords = [
      'good',
      'great',
      'awesome',
      'amazing',
      'love',
      'like',
      'happy',
    ];
    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'hate',
      'dislike',
      'angry',
      'sad',
    ];

    const words = content.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    const sentimentScore = (positiveCount - negativeCount) / words.length;
    const threshold = config.sentimentThreshold;

    return {
      matched: Math.abs(sentimentScore) >= threshold,
      score: sentimentScore,
    };
  }

  private async evaluateCustomRule(
    config: EscalationRule['triggerConfig'],
    context: EscalationContext,
  ): Promise<{ matched: boolean; data: Record<string, any> }> {
    // Custom rule evaluation logic
    // This can be extended based on specific requirements
    return {
      matched: false,
      data: {},
    };
  }

  private isHigherPriority(
    priority1: EscalationPriority,
    priority2: EscalationPriority,
  ): boolean {
    const priorityOrder = {
      [EscalationPriority.LOW]: 1,
      [EscalationPriority.MEDIUM]: 2,
      [EscalationPriority.HIGH]: 3,
      [EscalationPriority.CRITICAL]: 4,
    };

    return priorityOrder[priority1] > priorityOrder[priority2];
  }

  private async checkCooldown(rule: EscalationRule): Promise<boolean> {
    if (!rule.actionConfig?.cooldownPeriod) {
      return true;
    }

    const cooldownTime = new Date(
      (rule.lastTriggered?.getTime() || 0) +
        rule.actionConfig.cooldownPeriod * 1000,
    );

    return new Date() > cooldownTime;
  }

  private async createEscalationEvent(
    rule: EscalationRule,
    context: EscalationContext,
    triggerData: Record<string, any>,
  ): Promise<EscalationEvent> {
    try {
      const event = this.escalationEventRepository.create({
        ruleId: rule.id,
        messageId: context.message.id,
        streamerId: context.streamerId,
        streamId: context.streamId,
        userId: context.message.authorId,
        userName: context.message.authorName,
        messageContent: context.message.content,
        status: EscalationStatus.PENDING,
        triggerData,
      });

      const savedEvent = await this.escalationEventRepository.save(event);

      // Update rule usage count and last triggered
      rule.usageCount++;
      rule.lastTriggered = new Date();
      await this.escalationRuleRepository.save(rule);

      this.logger.log(`Created escalation event for rule: ${rule.name}`);
      return savedEvent;
    } catch (error) {
      this.logger.error('Failed to create escalation event:', error);
      throw error;
    }
  }

  async getEscalationEvents(
    streamerId: string,
    status?: EscalationStatus,
    limit: number = 50,
    offset: number = 0,
  ): Promise<EscalationEvent[]> {
    try {
      const query = this.escalationEventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.rule', 'rule')
        .where('event.streamerId = :streamerId', { streamerId });

      if (status) {
        query.andWhere('event.status = :status', { status });
      }

      return await query
        .orderBy('event.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();
    } catch (error) {
      this.logger.error('Failed to get escalation events:', error);
      throw error;
    }
  }

  async updateEscalationEvent(
    eventId: string,
    updates: Partial<EscalationEvent>,
  ): Promise<EscalationEvent | null> {
    try {
      const event = await this.escalationEventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return null;
      }

      Object.assign(event, updates);
      const updatedEvent = await this.escalationEventRepository.save(event);
      this.logger.log(`Updated escalation event: ${eventId}`);
      return updatedEvent;
    } catch (error) {
      this.logger.error('Failed to update escalation event:', error);
      throw error;
    }
  }

  async getEscalationStats(streamerId: string): Promise<{
    totalEvents: number;
    pendingEvents: number;
    resolvedEvents: number;
    eventsByPriority: Record<EscalationPriority, number>;
    eventsByRule: Record<string, number>;
  }> {
    try {
      const events = await this.escalationEventRepository.find({
        where: { streamerId },
      });

      const stats = {
        totalEvents: events.length,
        pendingEvents: events.filter(
          (e) => e.status === EscalationStatus.PENDING,
        ).length,
        resolvedEvents: events.filter(
          (e) => e.status === EscalationStatus.RESOLVED,
        ).length,
        eventsByPriority: {
          [EscalationPriority.LOW]: 0,
          [EscalationPriority.MEDIUM]: 0,
          [EscalationPriority.HIGH]: 0,
          [EscalationPriority.CRITICAL]: 0,
        },
        eventsByRule: {},
      };

      events.forEach((event) => {
        if (event.rule) {
          stats.eventsByPriority[event.rule.priority]++;
          stats.eventsByRule[event.rule.name] =
            (stats.eventsByRule[event.rule.name] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      this.logger.error('Failed to get escalation stats:', error);
      throw error;
    }
  }
}
