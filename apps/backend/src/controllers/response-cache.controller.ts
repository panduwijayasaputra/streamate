import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { ResponseCacheService } from '../services/response-cache.service';

@Controller('cache')
export class ResponseCacheController {
  constructor(private readonly responseCacheService: ResponseCacheService) {}

  @Get('stats')
  getCacheStats() {
    return this.responseCacheService.getCacheStats();
  }

  @Post('clear')
  clearCache() {
    this.responseCacheService.clearCache();
    return { message: 'Cache cleared successfully' };
  }

  @Delete('invalidate')
  invalidateCache(@Body() cacheKey: any) {
    this.responseCacheService.invalidateCache(cacheKey);
    return { message: 'Cache entry invalidated successfully' };
  }
}
