import { z } from 'zod';

export const createTransactionDto = z.object({
  source: z.enum(['SMS', 'EMAIL', 'MANUAL', 'API']),
  amount: z.number().positive(),
  currency: z.string().length(3).default('INR'),
  type: z.enum(['CREDIT', 'DEBIT']),
  merchantName: z.string().min(1).optional(),
  merchantId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  bankId: z.string().uuid().optional(),
  accountLastFourDigits: z.string().length(4).optional(),
  referenceNumber: z.string().optional(),
  balance: z.number().optional(),
  transactionDate: z.string().datetime(),
  description: z.string().optional(),
  hash: z.string().optional(),
  rawMetadata: z.record(z.string(), z.any()).optional(),
});

export const updateTransactionDto = z.object({
  categoryId: z.string().uuid().optional(),
  subCategoryId: z.string().uuid().optional(),
  description: z.string().optional(),
  status: z.enum(['COMPLETED', 'CANCELLED', 'FAILED', 'REVERSED', 'DISPUTED', 'REFUNDED', 'ARCHIVED', 'PENDING']).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionDto>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionDto>;
