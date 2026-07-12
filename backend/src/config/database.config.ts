import { z } from 'zod';
import { validateConfig } from './index';

const databaseSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const databaseConfig = validateConfig(databaseSchema, 'Database');
