import { z } from 'zod';
import { validateConfig } from './index';

const jwtSchema = z.object({
  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
});

export const jwtConfig = validateConfig(jwtSchema, 'JWT');
