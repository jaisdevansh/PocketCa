import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import { redisConfig } from '../config/redis.config';
import Redis from 'ioredis';

export const rateLimitPlugin = fp(async (fastify) => {
  await fastify.register(rateLimit, {
    max: 1000,
    timeWindow: '1 minute',
  });
});
