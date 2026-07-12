import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  title: z.string().min(1, 'Title is required').max(50, 'Title is too long'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export interface Transaction extends TransactionFormData {
  id: string;
  date: string;
  iconName: any; // We'll map category to icon later
}
