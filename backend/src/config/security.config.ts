import { z } from 'zod';
import { validateConfig } from './index';

const securitySchema = z.object({
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const securityConfig = validateConfig(securitySchema, 'Security');
