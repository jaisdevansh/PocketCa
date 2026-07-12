import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api';
import { GoalFormData } from '../schemas';

export const GOAL_KEYS = {
  all: ['goals'] as const,
};

export const useGoals = () => {
  return useQuery({
    queryKey: GOAL_KEYS.all,
    queryFn: goalsApi.getGoals,
  });
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GoalFormData) => goalsApi.addGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all });
    },
  });
};
