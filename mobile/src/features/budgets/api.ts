import { Budget } from './schemas';

const MOCK_BUDGETS: Budget[] = [
  { id: 'b1', category: 'Food & Dining', spentAmount: 420, limitAmount: 500 },
  { id: 'b2', category: 'Entertainment', spentAmount: 180, limitAmount: 150 }, // Over budget
  { id: 'b3', category: 'Transport', spentAmount: 80, limitAmount: 200 },
];

export const budgetsApi = {
  getBudgets: async (): Promise<Budget[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_BUDGETS]);
      }, 800);
    });
  },
};
