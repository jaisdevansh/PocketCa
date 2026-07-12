import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Shared environment object to avoid parsing multiple times
const rawEnv = process.env;

export function validateConfig<T>(schema: z.ZodType<T>, configName: string): T {
  const parsed = schema.safeParse(rawEnv);
  if (!parsed.success) {
    console.error(`❌ Invalid configuration for [${configName}]:`, parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
}

export const appEnv = rawEnv;
