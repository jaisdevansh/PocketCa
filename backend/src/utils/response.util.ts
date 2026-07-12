import { FastifyReply, FastifyRequest } from 'fastify';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error: any | null;
  meta: {
    requestId: string;
    timestamp: string;
    [key: string]: any;
  };
}

export function sendSuccess<T>(
  request: FastifyRequest,
  reply: FastifyReply,
  data: T,
  message: string = 'Success',
  additionalMeta: Record<string, any> = {},
  statusCode: number = 200
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    error: null,
    meta: {
      requestId: request.reqId || request.id || 'unknown',
      timestamp: new Date().toISOString(),
      ...additionalMeta,
    },
  };
  return reply.status(statusCode).send(response);
}

export function sendError(
  request: FastifyRequest,
  reply: FastifyReply,
  message: string = 'An error occurred',
  error: any = null,
  statusCode: number = 500
) {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    error,
    meta: {
      requestId: request.reqId || request.id || 'unknown',
      timestamp: new Date().toISOString(),
    },
  };
  return reply.status(statusCode).send(response);
}
