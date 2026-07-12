import { z } from 'zod';

export const connectGmailDto = z.object({
  userId: z.string().uuid(),
});

export const callbackGmailDto = z.object({
  code: z.string(),
  state: z.string().uuid(), // Maps back to userId
});
