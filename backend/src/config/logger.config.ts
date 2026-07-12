import { z } from 'zod';
import { validateConfig } from './index';

const loggerSchema = z.object({
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export const loggerConfig = validateConfig(loggerSchema, 'Logger');
