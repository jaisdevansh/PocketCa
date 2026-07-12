import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { redisConfig } from '../config/redis.config';

export const redisPlugin = fp(async (fastify) => {
  const redis = new Redis(redisConfig.REDIS_URL, {
    maxRetriesPerRequest: null, // Required for bullmq
  });

  redis.on('error', (err) => {
    fastify.log.error({ err }, 'Redis connection error');
  });

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async (instance) => {
    await instance.redis.quit();
  });
});
