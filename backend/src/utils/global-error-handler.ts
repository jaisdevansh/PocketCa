import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './custom-exceptions';
import { sendError } from './response.util';

export const globalErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error({ err: error }, 'Global Error Handler caught an exception');

  // Handle Zod Validation Errors (from fastify-type-provider-zod)
  if (error instanceof ZodError || error.code === 'FST_ERR_VALIDATION') {
    return sendError(
      request,
      reply,
      'Validation Error',
      {
        code: 'VALIDATION_ERROR',
        details: error instanceof ZodError ? (error as any).issues || (error as any).errors : (error as any).validation,
      },
      400
    );
  }

  // Handle Custom Application Errors
  if (error instanceof AppError) {
    return sendError(
      request,
      reply,
      error.message,
      { code: error.errorCode, meta: error.meta },
      error.statusCode
    );
  }

  // Handle JWT Auth Errors
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED' || error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
     return sendError(
       request,
       reply,
       'Authentication Failed',
       { code: 'UNAUTHORIZED' },
       401
     );
  }

  // Handle Unknown Internal Server Errors
  const isProduction = process.env.NODE_ENV === 'production';
  return sendError(
    request,
    reply,
    isProduction ? 'Internal Server Error' : error.message,
    isProduction ? { code: 'INTERNAL_SERVER_ERROR' } : { code: 'INTERNAL_SERVER_ERROR', stack: error.stack },
    500
  );
};
