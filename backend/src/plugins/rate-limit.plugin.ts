import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import { redisConfig } from '../config/redis.config';
import Redis from 'ioredis';

export const rateLimitPlugin = fp(async (fastify) => {
  const redis = new Redis(redisConfig.REDIS_URL);
  
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis,
  });
});
