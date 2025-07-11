import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);

    // Log incoming request
    this.logRequest(req, requestId);

    // Log response when request completes
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logResponse(req, res, duration, requestId);
    });

    next();
  }

  private logRequest(req: Request, requestId: string) {
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentLength: req.get('Content-Length'),
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`Incoming Request: ${req.method} ${req.path}`, logData);
  }

  private logResponse(
    req: Request,
    res: Response,
    duration: number,
    requestId: string,
  ) {
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString(),
    };

    const logLevel = res.statusCode >= 400 ? 'warn' : 'log';
    this.logger[logLevel](
      `Response: ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
      logData,
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
