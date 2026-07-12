import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';

export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  message = 'Success',
  meta = {},
  statusCode = 200
) {
  const requestId = reply.request.id || randomUUID();
  
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
    requestId,
  });
}
