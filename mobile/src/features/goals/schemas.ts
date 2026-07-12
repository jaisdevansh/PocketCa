import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(1, 'Goal name is required').max(40, 'Name is too long'),
  targetAmount: z.coerce.number().positive('Target amount must be greater than 0'),
  targetDate: z.string().optional(), // Date string, optional per Part 9 rules
  iconName: z.string().default('Target'), 
});

export type GoalFormData = z.infer<typeof goalSchema>;

export interface Goal extends GoalFormData {
  id: string;
  currentAmount: number;
  createdAt: string;
}
