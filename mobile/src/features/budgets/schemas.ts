import { z } from 'zod';

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limitAmount: z.coerce.number().positive('Budget limit must be greater than 0'),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

export interface Budget extends BudgetFormData {
  id: string;
  spentAmount: number;
}
