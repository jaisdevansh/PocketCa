import { z } from 'zod';
import { validateConfig } from './index';

const gmailSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string().url().default('http://localhost:3000/api/v1/gmail/callback'),
});

export const gmailConfig = validateConfig(gmailSchema, 'Gmail');
