import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { BaseError } from './base.error';
import { randomUUID } from 'crypto';

export const globalErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

  const requestId = request.id || randomUUID();
  const timestamp = new Date().toISOString();

  // Handle custom domain errors
  if (error instanceof BaseError) {
    return reply.status(error.code).send({
      success: false,
      message: error.message,
      error: error.type,
      code: error.code,
      details: error.details || {},
      timestamp,
      requestId,
    } as any);
  }

  // Handle Fastify/Zod validation errors
  if (error.validation) {
    return reply.status(422).send({
      success: false,
      message: 'Validation Error',
      error: 'VALIDATION_ERROR',
      code: 422,
      details: error.validation,
      timestamp,
      requestId,
    } as any);
  }

  // Handle unknown errors
  return reply.status(500).send({
    success: false,
    message: 'Internal Server Error',
    error: 'INTERNAL_ERROR',
    code: 500,
    details: {},
    timestamp,
    requestId,
  } as any);
};
