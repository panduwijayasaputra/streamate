import {
  Injectable,
  NestMiddleware,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
}

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ErrorHandlerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = this.generateRequestId();

    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);

    // Wrap the next function to catch errors
    const wrappedNext = (err?: unknown) => {
      if (err) {
        this.handleError(err, req, res, requestId);
      } else {
        next();
      }
    };

    // Add error handler to response
    res.on('error', (err: unknown) => {
      this.handleError(err, req, res, requestId);
    });

    // Call next with wrapped function
    next(wrappedNext);
  }

  private handleError(
    error: any,
    req: Request,
    res: Response,
    requestId: string,
  ) {
    const errorResponse: ErrorResponse = {
      statusCode: this.getStatusCode(error),
      message: this.getMessage(error),
      error: this.getErrorType(error),
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      requestId,
    };

    // Log the error
    this.logError(error, req, requestId);

    // Send error response
    if (!res.headersSent) {
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  private getStatusCode(error: unknown): number {
    if (error instanceof HttpException) {
      return error.getStatus();
    }
    if (typeof error === 'object' && error !== null && 'status' in error) {
      return (error as { status: number }).status;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(error: unknown): string {
    if (error instanceof HttpException) {
      const response = error.getResponse();
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        return (response as { message: string }).message;
      }
      return error.message;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as { message: string }).message;
    }
    return 'Internal server error';
  }

  private getErrorType(error: unknown): string {
    if (error instanceof HttpException) {
      const response = error.getResponse();
      if (
        typeof response === 'object' &&
        response !== null &&
        'error' in response
      ) {
        return (response as { error: string }).error;
      }
      return 'HttpException';
    }
    if (typeof error === 'object' && error !== null && 'constructor' in error) {
      return (error as { constructor: { name: string } }).constructor.name;
    }
    return 'Error';
  }

  private logError(error: unknown, req: Request, requestId: string) {
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      error: {
        name:
          typeof error === 'object' && error !== null && 'name' in error
            ? (error as { name: string }).name
            : 'Unknown',
        message:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'Unknown error',
        stack:
          typeof error === 'object' && error !== null && 'stack' in error
            ? (error as { stack: string }).stack
            : undefined,
        statusCode: this.getStatusCode(error),
      },
    };

    if (this.getStatusCode(error) >= 500) {
      this.logger.error('Server Error', logData);
    } else {
      this.logger.warn('Client Error', logData);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
