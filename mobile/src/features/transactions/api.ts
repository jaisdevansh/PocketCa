import { Transaction, TransactionFormData } from './schemas';
import { apiClient } from '@/core/api/client';

export const transactionsApi = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get('/transactions');
    return response.data.data; // Assuming fastify returns { data: [...] }
  },

  addTransaction: async (data: TransactionFormData): Promise<Transaction> => {
    const payload = {
      ...data,
      type: data.type.toUpperCase(),
    };
    const response = await apiClient.post('/transactions', payload);
    return response.data.data;
  },
};
