import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestCounts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  private readonly rateLimits: Record<string, RateLimitConfig> = {
    default: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      message: 'Too many requests from this IP, please try again later.',
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      message: 'Too many authentication attempts, please try again later.',
    },
    chat: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 1000,
      message: 'Too many chat messages, please slow down.',
    },
    ai: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 50,
      message: 'Too many AI requests, please try again later.',
    },
  };

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = this.getClientId(req);
    const routeType = this.getRouteType(req.path);
    const config = this.rateLimits[routeType] || this.rateLimits.default;

    const now = Date.now();
    const clientData = this.requestCounts.get(clientId);

    // Reset counter if window has passed
    if (!clientData || now > clientData.resetTime) {
      this.requestCounts.set(clientId, {
        count: 1,
        resetTime: now + config.windowMs,
      });
    } else {
      // Increment counter
      clientData.count++;

      // Check if limit exceeded
      if (clientData.count > config.maxRequests) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: config.message,
            error: 'Too Many Requests',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader(
      'X-RateLimit-Remaining',
      config.maxRequests - (clientData?.count || 1),
    );
    res.setHeader(
      'X-RateLimit-Reset',
      Math.ceil((clientData?.resetTime || now + config.windowMs) / 1000),
    );

    next();
  }

  private getClientId(req: Request): string {
    // Use IP address as client identifier
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  private getRouteType(path: string): string {
    if (path.startsWith('/auth')) {
      return 'auth';
    }
    if (path.startsWith('/chat') || path.includes('message')) {
      return 'chat';
    }
    if (path.startsWith('/ai') || path.includes('response')) {
      return 'ai';
    }
    return 'default';
  }

  // Method to clean up old entries (can be called periodically)
  cleanup() {
    const now = Date.now();
    for (const [clientId, data] of this.requestCounts.entries()) {
      if (now > data.resetTime) {
        this.requestCounts.delete(clientId);
      }
    }
  }
}
