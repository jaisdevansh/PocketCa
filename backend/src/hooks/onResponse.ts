import { FastifyRequest, FastifyReply } from 'fastify';

export async function onResponseHook(request: FastifyRequest, reply: FastifyReply) {
  const duration = Date.now() - (request.startTime || Date.now());
  
  request.log.info(
    { 
      reqId: request.reqId, 
      statusCode: reply.statusCode,
      durationMs: duration 
    }, 
    'Outgoing Response'
  );
}
