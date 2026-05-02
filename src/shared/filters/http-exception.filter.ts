import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = this.getStatusCode(exception);
    const errorResponse = this.getErrorResponse(exception, statusCode);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      error: errorResponse.error,
      message: errorResponse.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getStatusCode(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (exception instanceof QueryFailedError) {
      const code = (exception as any).code;
      return code === 'ER_DUP_ENTRY' || code === '23505'
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorResponse(exception: unknown, statusCode: number) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return {
          error: exception.name,
          message: response,
        };
      }

      const body = response as {
        error?: string;
        message?: string | string[];
      };

      return {
        error: body.error ?? exception.name,
        message: body.message ?? exception.message,
      };
    }

    if (exception instanceof QueryFailedError) {
      const code = (exception as any).code;

      if (code === 'ER_DUP_ENTRY' || code === '23505') {
        return {
          error: 'Bad Request',
          message: 'Registro duplicado',
        };
      }

      return {
        error: 'Database Error',
        message: 'Erro ao processar dados no banco',
      };
    }

    return {
      error: 'Internal Server Error',
      message:
        process.env.NODE_ENV === 'production'
          ? 'Erro interno no servidor'
          : exception instanceof Error
            ? exception.message
            : 'Erro interno no servidor',
    };
  }
}
