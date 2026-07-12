import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';

export async function onRequestHook(request: FastifyRequest, reply: FastifyReply) {
  request.reqId = crypto.randomUUID();
  request.traceId = (request.headers['x-trace-id'] as string) || crypto.randomUUID();
  request.startTime = Date.now();
  
  // Attach request ID to the reply header as well
  reply.header('x-request-id', request.reqId);
  reply.header('x-trace-id', request.traceId);

  request.log.info(
    { 
      reqId: request.reqId, 
      traceId: request.traceId,
      url: request.url, 
      method: request.method,
      ip: request.ip
    }, 
    'Incoming Request'
  );
}
