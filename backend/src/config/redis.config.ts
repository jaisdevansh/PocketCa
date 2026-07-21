import { z } from 'zod';
import { validateConfig } from './index';

const redisSchema = z.object({
  REDIS_URL: z.string().url(),
});

export const redisConfig = validateConfig(redisSchema, 'Redis');

const redisUrl = new URL(redisConfig.REDIS_URL);
const isTls = redisUrl.protocol === 'rediss:';

export const sharedBullMqConnection = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || '6379', 10),
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times: number) => {
    return Math.min(times * 1000, 10000); // Backoff up to 10 seconds
  },
  ...(isTls ? { tls: { rejectUnauthorized: false } } : {}),
};
