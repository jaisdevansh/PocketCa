import { FastifyInstance } from 'fastify';
import { systemController } from '../controller/system.controller';
import { z } from 'zod';

export default async function systemRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/queue/status', {
    schema: { tags: ['System'], summary: 'Get status of all BullMQ queues' },
    handler: systemController.getQueueStatus,
  });

  fastify.get('/workers', {
    schema: { tags: ['System'], summary: 'Get list of active workers' },
    handler: systemController.getWorkers,
  });

  fastify.post('/cache/clear', {
    schema: {
      tags: ['System'],
      summary: 'Clear cache by key or tag',
      body: z.object({
        key: z.string().optional(),
        tag: z.string().optional(),
      })
    },
    handler: systemController.clearCache,
  });

  fastify.get('/events', {
    schema: { tags: ['System'], summary: 'Get recent event logs' },
    handler: systemController.getEvents,
  });

  fastify.get('/notifications', {
    schema: { tags: ['System'], summary: 'Get user notifications' },
    handler: systemController.getNotifications,
  });

  fastify.get('/insights', {
    schema: { tags: ['System'], summary: 'Get AI insights' },
    handler: systemController.getInsights,
  });
}
