import { z } from 'zod';
import { logger } from '../../utils/logger';

export const aiInsightResponseSchema = z.object({
  type: z.enum(['SPENDING_ANOMALY', 'SAVING_OPPORTUNITY', 'UPCOMING_BILL', 'GENERAL_ADVICE']),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  confidenceScore: z.number().min(0).max(1),
  actionable: z.boolean(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export class ResponseValidator {
  /**
   * Validates if the AI output matches the expected JSON schema.
   * Throws or returns an error object if malformed.
   */
  validateInsightResponse(rawContent: string): z.infer<typeof aiInsightResponseSchema> | null {
    try {
      // Sometimes LLMs return markdown fenced blocks (```json ... ```)
      const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      
      return aiInsightResponseSchema.parse(parsed);
    } catch (error) {
      logger.error('Failed to validate AI Response', error);
      return null;
    }
  }
}

export const responseValidator = new ResponseValidator();
