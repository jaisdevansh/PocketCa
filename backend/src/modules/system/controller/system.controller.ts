import { FastifyRequest, FastifyReply } from 'fastify';
import { queueFactory, QUEUE_NAMES } from '../../../queues/queue.factory';
import { cacheService } from '../../../cache/cache.service';
import { db } from '../../../database/connection/database';
import { eventLogs, notifications } from '../../../database/schema/system';
import { aiInsights } from '../../../database/schema/ai';
import { eq, desc } from 'drizzle-orm';

export class SystemController {
  async getQueueStatus(request: FastifyRequest, reply: FastifyReply) {
    const statuses: Record<string, any> = {};
    for (const name of Object.values(QUEUE_NAMES)) {
      try {
        const q = queueFactory.getQueue(name);
        statuses[name] = {
          waiting: await q.getWaitingCount(),
          active: await q.getActiveCount(),
          completed: await q.getCompletedCount(),
          failed: await q.getFailedCount(),
        };
      } catch (e) {
        statuses[name] = { error: 'Queue not available' };
      }
    }
    return reply.send({ data: statuses });
  }

  async getWorkers(request: FastifyRequest, reply: FastifyReply) {
    // Return list of running workers (In BullMQ, workers are attached to queues)
    // For now, returning standard metadata
    return reply.send({ 
      data: {
        workers: Object.values(QUEUE_NAMES).map(q => ({ queue: q, status: 'RUNNING' }))
      }
    });
  }

  async clearCache(request: FastifyRequest<{ Body: { key?: string, tag?: string } }>, reply: FastifyReply) {
    const { key, tag } = request.body || {};
    if (key) {
      await cacheService.del(key);
    } else if (tag) {
      await cacheService.invalidateByTag(tag);
    } else {
      return reply.status(400).send({ error: 'Must provide key or tag' });
    }
    return reply.send({ message: 'Cache cleared' });
  }

  async getEvents(request: FastifyRequest, reply: FastifyReply) {
    const records = await db.select().from(eventLogs).orderBy(desc(eventLogs.createdAt)).limit(50);
    return reply.send({ data: records });
  }

  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const records = await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
    return reply.send({ data: records });
  }

  async getInsights(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const records = await db.select().from(aiInsights).where(eq(aiInsights.userId, userId)).orderBy(desc(aiInsights.createdAt)).limit(20);
    return reply.send({ data: records });
  }
}

export const systemController = new SystemController();
