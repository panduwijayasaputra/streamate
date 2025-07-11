import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CachedResponse {
  content: string;
  metadata: {
    aiModel: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    responseTime: number;
    confidence: number;
    cacheHit: boolean;
    cachedAt: Date;
  };
  expiresAt: Date;
}

export interface CacheKey {
  messageContent: string;
  streamerId: string;
  contextHash: string;
  personalizationHash: string;
}

@Injectable()
export class ResponseCacheService {
  private readonly logger = new Logger(ResponseCacheService.name);
  private cache = new Map<string, CachedResponse>();
  private readonly config: {
    maxCacheSize: number;
    defaultTTL: number; // in milliseconds
    cleanupInterval: number; // in milliseconds
  };

  constructor(private readonly configService: ConfigService) {
    this.config = {
      maxCacheSize: parseInt(process.env.RESPONSE_CACHE_MAX_SIZE || '1000', 10),
      defaultTTL: parseInt(process.env.RESPONSE_CACHE_TTL || '3600000', 10), // 1 hour
      cleanupInterval: parseInt(
        process.env.RESPONSE_CACHE_CLEANUP_INTERVAL || '300000',
        10,
      ), // 5 minutes
    };

    // Start cleanup interval
    setInterval(() => this.cleanup(), this.config.cleanupInterval);
    this.logger.log('Response cache service initialized');
  }

  /**
   * Generate a cache key based on message content and context
   */
  private generateCacheKey(cacheKey: CacheKey): string {
    const keyData = {
      content: cacheKey.messageContent.toLowerCase().trim(),
      streamerId: cacheKey.streamerId,
      context: cacheKey.contextHash,
      personalization: cacheKey.personalizationHash,
    };

    // Create a hash of the key data
    const keyString = JSON.stringify(keyData);
    return Buffer.from(keyString).toString('base64').slice(0, 32);
  }

  /**
   * Check if a response exists in cache
   */
  getCachedResponse(cacheKey: CacheKey): CachedResponse | null {
    try {
      const key = this.generateCacheKey(cacheKey);
      const cached = this.cache.get(key);

      if (!cached) {
        return null;
      }

      // Check if cache entry has expired
      if (new Date() > cached.expiresAt) {
        this.cache.delete(key);
        return null;
      }

      this.logger.debug(`Cache hit for key: ${key}`);
      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          cacheHit: true,
        },
      };
    } catch (error) {
      this.logger.error('Error retrieving cached response:', error);
      return null;
    }
  }

  /**
   * Store a response in cache
   */
  cacheResponse(
    cacheKey: CacheKey,
    response: {
      content: string;
      metadata: {
        aiModel: string;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        responseTime: number;
        confidence: number;
      };
    },
    ttl?: number,
  ): void {
    try {
      const key = this.generateCacheKey(cacheKey);
      const expiresAt = new Date(Date.now() + (ttl || this.config.defaultTTL));

      const cachedResponse: CachedResponse = {
        content: response.content,
        metadata: {
          ...response.metadata,
          cacheHit: false,
          cachedAt: new Date(),
        },
        expiresAt,
      };

      // Check cache size limit
      if (this.cache.size >= this.config.maxCacheSize) {
        this.evictOldest();
      }

      this.cache.set(key, cachedResponse);
      this.logger.debug(`Cached response for key: ${key}`);
    } catch (error) {
      this.logger.error('Error caching response:', error);
    }
  }

  /**
   * Remove a specific response from cache
   */
  invalidateCache(cacheKey: CacheKey): void {
    try {
      const key = this.generateCacheKey(cacheKey);
      this.cache.delete(key);
      this.logger.debug(`Invalidated cache for key: ${key}`);
    } catch (error) {
      this.logger.error('Error invalidating cache:', error);
    }
  }

  /**
   * Clear all cached responses
   */
  clearCache(): void {
    try {
      this.cache.clear();
      this.logger.log('Cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    totalHits: number;
    totalMisses: number;
  } {
    const totalRequests = this.totalHits + this.totalMisses;
    const hitRate = totalRequests > 0 ? this.totalHits / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxCacheSize,
      hitRate,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
    };
  }

  /**
   * Clean up expired cache entries
   */
  private cleanup(): void {
    try {
      const now = new Date();
      let cleanedCount = 0;

      for (const [key, value] of this.cache.entries()) {
        if (now > value.expiresAt) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        this.logger.debug(`Cleaned up ${cleanedCount} expired cache entries`);
      }
    } catch (error) {
      this.logger.error('Error during cache cleanup:', error);
    }
  }

  /**
   * Evict the oldest cache entry when cache is full
   */
  private evictOldest(): void {
    try {
      let oldestKey: string | null = null;
      let oldestTime = new Date();

      for (const [key, value] of this.cache.entries()) {
        if (value.metadata.cachedAt < oldestTime) {
          oldestTime = value.metadata.cachedAt;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.logger.debug(`Evicted oldest cache entry: ${oldestKey}`);
      }
    } catch (error) {
      this.logger.error('Error evicting oldest cache entry:', error);
    }
  }

  // Cache statistics
  private totalHits = 0;
  private totalMisses = 0;

  /**
   * Record cache hit
   */
  private recordHit(): void {
    this.totalHits++;
  }

  /**
   * Record cache miss
   */
  private recordMiss(): void {
    this.totalMisses++;
  }
}
