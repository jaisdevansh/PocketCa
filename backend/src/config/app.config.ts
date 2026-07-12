import { z } from 'zod';
import { validateConfig } from './index';

const appSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  API_PREFIX: z.string().default('/api/v1'),
  APP_NAME: z.string().default('PocketCA'),
  APP_VERSION: z.string().default('1.0.0'),
  DEMO_PHONES: z.string().optional().default('8795162029,7052275674').transform(val => val.split(',').map(s => s.trim())),
  DEMO_OTP: z.string().optional().default('123456'),
  GROQ_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  DEFAULT_AI_PROVIDER: z.enum(['groq', 'gemini', 'openai']).default('groq'),
  DEFAULT_AI_MODEL: z.string().default('llama3-8b-8192'),
});

export const appConfig = validateConfig(appSchema, 'App');
