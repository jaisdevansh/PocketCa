import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';

export async function onErrorHook(request: FastifyRequest, reply: FastifyReply, error: FastifyError) {
  request.log.error(
    { 
      reqId: request.reqId, 
      err: error 
    }, 
    'Request Error'
  );
}
