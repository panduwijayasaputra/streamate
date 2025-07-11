import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FrequencyLimitConfig {
  maxResponsesPerMinute: number;
  maxResponsesPerStream: number;
  cooldownPeriodMs: number;
  burstLimit: number;
  burstWindowMs: number;
}

export interface StreamLimits {
  streamId: string;
  lastResponseTime: Date;
  responseCount: number;
  burstCount: number;
  burstStartTime: Date;
}

@Injectable()
export class ResponseFrequencyLimiterService {
  private readonly logger = new Logger(ResponseFrequencyLimiterService.name);
  private streamLimits = new Map<string, StreamLimits>();
  private globalLimits = {
    lastResponseTime: new Date(0),
    responseCount: 0,
    burstCount: 0,
    burstStartTime: new Date(0),
  };

  private readonly config: FrequencyLimitConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      maxResponsesPerMinute: parseInt(
        process.env.AI_MAX_RESPONSES_PER_MINUTE || '30',
        10,
      ),
      maxResponsesPerStream: parseInt(
        process.env.AI_MAX_RESPONSES_PER_STREAM || '10',
        10,
      ),
      cooldownPeriodMs: parseInt(
        process.env.AI_COOLDOWN_PERIOD_MS || '2000',
        10,
      ), // 2 seconds
      burstLimit: parseInt(process.env.AI_BURST_LIMIT || '5', 10),
      burstWindowMs: parseInt(process.env.AI_BURST_WINDOW_MS || '10000', 10), // 10 seconds
    };

    this.logger.log('Response frequency limiter initialized');
  }

  /**
   * Check if AI can respond to a message in a specific stream
   */
  canRespond(streamId: string): {
    allowed: boolean;
    reason?: string;
    waitTimeMs?: number;
  } {
    try {
      const now = new Date();
      const streamLimit = this.getOrCreateStreamLimit(streamId);

      // Check global burst limit
      const globalBurstResult = this.checkBurstLimit(this.globalLimits, now);
      if (!globalBurstResult.allowed) {
        return {
          allowed: false,
          reason: 'Global burst limit exceeded',
          waitTimeMs: globalBurstResult.waitTimeMs,
        };
      }

      // Check stream-specific burst limit
      const streamBurstResult = this.checkBurstLimit(streamLimit, now);
      if (!streamBurstResult.allowed) {
        return {
          allowed: false,
          reason: 'Stream burst limit exceeded',
          waitTimeMs: streamBurstResult.waitTimeMs,
        };
      }

      // Check cooldown period
      const cooldownResult = this.checkCooldownPeriod(streamLimit, now);
      if (!cooldownResult.allowed) {
        return {
          allowed: false,
          reason: 'Cooldown period active',
          waitTimeMs: cooldownResult.waitTimeMs,
        };
      }

      // Check per-stream response limit
      const streamLimitResult = this.checkStreamResponseLimit(streamLimit, now);
      if (!streamLimitResult.allowed) {
        return {
          allowed: false,
          reason: 'Stream response limit exceeded',
          waitTimeMs: streamLimitResult.waitTimeMs,
        };
      }

      return { allowed: true };
    } catch (error) {
      this.logger.error('Error checking response frequency limits:', error);
      return { allowed: false, reason: 'Error checking limits' };
    }
  }

  /**
   * Record that an AI response was sent
   */
  recordResponse(streamId: string): void {
    try {
      const now = new Date();
      const streamLimit = this.getOrCreateStreamLimit(streamId);

      // Update stream limits
      streamLimit.lastResponseTime = now;
      streamLimit.responseCount++;
      this.updateBurstCount(streamLimit, now);

      // Update global limits
      this.globalLimits.lastResponseTime = now;
      this.globalLimits.responseCount++;
      this.updateBurstCount(this.globalLimits, now);

      this.logger.debug(
        `Response recorded for stream ${streamId}. Stream count: ${streamLimit.responseCount}, Global count: ${this.globalLimits.responseCount}`,
      );
    } catch (error) {
      this.logger.error('Error recording response:', error);
    }
  }

  /**
   * Get current limits for a stream
   */
  getStreamLimits(streamId: string): {
    streamId: string;
    responseCount: number;
    lastResponseTime: Date;
    burstCount: number;
    timeUntilReset: number;
  } | null {
    const streamLimit = this.streamLimits.get(streamId);
    if (!streamLimit) return null;

    const now = new Date();
    const timeSinceLastResponse =
      now.getTime() - streamLimit.lastResponseTime.getTime();
    const timeUntilReset = Math.max(0, 60000 - timeSinceLastResponse); // 1 minute window

    return {
      streamId: streamLimit.streamId,
      responseCount: streamLimit.responseCount,
      lastResponseTime: streamLimit.lastResponseTime,
      burstCount: streamLimit.burstCount,
      timeUntilReset,
    };
  }

  /**
   * Get global frequency statistics
   */
  getGlobalStats(): {
    totalResponses: number;
    lastResponseTime: Date;
    burstCount: number;
    activeStreams: number;
  } {
    const now = new Date();
    const activeStreams = Array.from(this.streamLimits.values()).filter(
      (limit) => now.getTime() - limit.lastResponseTime.getTime() < 300000, // 5 minutes
    ).length;

    return {
      totalResponses: this.globalLimits.responseCount,
      lastResponseTime: this.globalLimits.lastResponseTime,
      burstCount: this.globalLimits.burstCount,
      activeStreams,
    };
  }

  /**
   * Reset limits for a specific stream
   */
  resetStreamLimits(streamId: string): void {
    this.streamLimits.delete(streamId);
    this.logger.log(`Reset frequency limits for stream ${streamId}`);
  }

  /**
   * Reset all limits
   */
  resetAllLimits(): void {
    this.streamLimits.clear();
    this.globalLimits = {
      lastResponseTime: new Date(0),
      responseCount: 0,
      burstCount: 0,
      burstStartTime: new Date(0),
    };
    this.logger.log('Reset all frequency limits');
  }

  /**
   * Clean up old stream limits
   */
  cleanup(): void {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - 300000); // 5 minutes

    let cleanedCount = 0;
    for (const [streamId, limit] of this.streamLimits.entries()) {
      if (limit.lastResponseTime < cutoffTime) {
        this.streamLimits.delete(streamId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} old stream limits`);
    }
  }

  /**
   * Get or create stream limits
   */
  private getOrCreateStreamLimit(streamId: string): StreamLimits {
    let streamLimit = this.streamLimits.get(streamId);
    if (!streamLimit) {
      streamLimit = {
        streamId,
        lastResponseTime: new Date(0),
        responseCount: 0,
        burstCount: 0,
        burstStartTime: new Date(0),
      };
      this.streamLimits.set(streamId, streamLimit);
    }
    return streamLimit;
  }

  /**
   * Check burst limit
   */
  private checkBurstLimit(
    limits: StreamLimits | typeof this.globalLimits,
    now: Date,
  ): { allowed: boolean; waitTimeMs?: number } {
    const timeSinceBurstStart = now.getTime() - limits.burstStartTime.getTime();

    // Reset burst count if window has passed
    if (timeSinceBurstStart > this.config.burstWindowMs) {
      limits.burstCount = 0;
      limits.burstStartTime = now;
    }

    if (limits.burstCount >= this.config.burstLimit) {
      const waitTimeMs = this.config.burstWindowMs - timeSinceBurstStart;
      return { allowed: false, waitTimeMs };
    }

    return { allowed: true };
  }

  /**
   * Check cooldown period
   */
  private checkCooldownPeriod(
    streamLimit: StreamLimits,
    now: Date,
  ): { allowed: boolean; waitTimeMs?: number } {
    const timeSinceLastResponse =
      now.getTime() - streamLimit.lastResponseTime.getTime();

    if (timeSinceLastResponse < this.config.cooldownPeriodMs) {
      const waitTimeMs = this.config.cooldownPeriodMs - timeSinceLastResponse;
      return { allowed: false, waitTimeMs };
    }

    return { allowed: true };
  }

  /**
   * Check per-stream response limit
   */
  private checkStreamResponseLimit(
    streamLimit: StreamLimits,
    now: Date,
  ): { allowed: boolean; waitTimeMs?: number } {
    const timeSinceLastResponse =
      now.getTime() - streamLimit.lastResponseTime.getTime();

    // Reset count if a minute has passed
    if (timeSinceLastResponse > 60000) {
      streamLimit.responseCount = 0;
    }

    if (streamLimit.responseCount >= this.config.maxResponsesPerStream) {
      const waitTimeMs = 60000 - timeSinceLastResponse;
      return { allowed: false, waitTimeMs };
    }

    return { allowed: true };
  }

  /**
   * Update burst count
   */
  private updateBurstCount(
    limits: StreamLimits | typeof this.globalLimits,
    now: Date,
  ): void {
    const timeSinceBurstStart = now.getTime() - limits.burstStartTime.getTime();

    if (timeSinceBurstStart > this.config.burstWindowMs) {
      limits.burstCount = 1;
      limits.burstStartTime = now;
    } else {
      limits.burstCount++;
    }
  }
}
