import { useQuery } from '@tanstack/react-query';
import { budgetsApi } from '../api';

export const BUDGET_KEYS = {
  all: ['budgets'] as const,
};

export const useBudgets = () => {
  return useQuery({
    queryKey: BUDGET_KEYS.all,
    queryFn: budgetsApi.getBudgets,
  });
};
