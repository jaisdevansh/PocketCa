import { z } from 'zod';

export const billSchema = z.object({
  title: z.string().min(1, 'Bill name is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export type BillFormData = z.infer<typeof billSchema>;

export interface Bill extends BillFormData {
  id: string;
  isPaid: boolean;
  iconName: string;
}
