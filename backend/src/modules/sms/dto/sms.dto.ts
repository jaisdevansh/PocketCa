import { z } from 'zod';

export const smsSyncSchema = z.object({
  messages: z.array(z.object({
    id: z.string(),
    sender: z.string(),
    body: z.string(),
    receivedAt: z.string().datetime(),
  })).max(1000, "Cannot process more than 1000 SMS per batch"),
});

export type SmsSyncDto = z.infer<typeof smsSyncSchema>;
