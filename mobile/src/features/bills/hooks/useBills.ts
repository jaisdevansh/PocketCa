import { useQuery } from '@tanstack/react-query';
import { billsApi } from '../api';

export const BILL_KEYS = {
  upcoming: ['bills', 'upcoming'] as const,
};

export const useUpcomingBills = () => {
  return useQuery({
    queryKey: BILL_KEYS.upcoming,
    queryFn: billsApi.getUpcomingBills,
  });
};
