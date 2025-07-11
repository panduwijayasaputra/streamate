import { Controller, Get, Post, Param } from '@nestjs/common';
import { ResponseFrequencyLimiterService } from '../services/response-frequency-limiter.service';

@Controller('frequency-limiter')
export class FrequencyLimiterController {
  constructor(
    private readonly frequencyLimiter: ResponseFrequencyLimiterService,
  ) {}

  @Get('stats/global')
  getGlobalStats() {
    return this.frequencyLimiter.getGlobalStats();
  }

  @Get('stats/stream/:streamId')
  getStreamLimits(@Param('streamId') streamId: string) {
    return this.frequencyLimiter.getStreamLimits(streamId);
  }

  @Post('reset/stream/:streamId')
  resetStreamLimits(@Param('streamId') streamId: string) {
    this.frequencyLimiter.resetStreamLimits(streamId);
    return { message: `Frequency limits reset for stream ${streamId}` };
  }

  @Post('reset/all')
  resetAllLimits() {
    this.frequencyLimiter.resetAllLimits();
    return { message: 'All frequency limits reset' };
  }

  @Post('cleanup')
  cleanup() {
    this.frequencyLimiter.cleanup();
    return { message: 'Cleanup completed' };
  }

  @Post('test/:streamId')
  testFrequencyLimit(@Param('streamId') streamId: string) {
    const result = this.frequencyLimiter.canRespond(streamId);
    return {
      streamId,
      canRespond: result.allowed,
      reason: result.reason,
      waitTimeMs: result.waitTimeMs,
    };
  }
}
