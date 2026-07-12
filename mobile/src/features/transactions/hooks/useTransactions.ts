import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api';
import { TransactionFormData } from '../schemas';

export const TRANSACTION_KEYS = {
  all: ['transactions'] as const,
};

export const useTransactions = () => {
  return useQuery({
    queryKey: TRANSACTION_KEYS.all,
    queryFn: transactionsApi.getTransactions,
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionFormData) => transactionsApi.addTransaction(data),
    onSuccess: () => {
      // Invalidate the cache to trigger a refetch of the list
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.all });
    },
  });
};
