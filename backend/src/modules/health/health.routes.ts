import { FastifyInstance } from 'fastify';
import { healthController } from './health.controller';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        description: 'Check system health',
        tags: ['System'],
      },
    },
    healthController.checkHealth
  );
}
