import { Goal, GoalFormData } from './schemas';

let MOCK_GOALS: Goal[] = [
  { id: 'g1', title: 'Emergency Fund', currentAmount: 4500, targetAmount: 10000, iconName: 'Shield', createdAt: new Date().toISOString() },
  { id: 'g2', title: 'Japan Vacation', currentAmount: 1200, targetAmount: 4000, iconName: 'Plane', targetDate: '2027-04-01', createdAt: new Date().toISOString() },
  { id: 'g3', title: 'New MacBook', currentAmount: 200, targetAmount: 2500, iconName: 'Laptop', createdAt: new Date().toISOString() },
];

export const goalsApi = {
  getGoals: async (): Promise<Goal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_GOALS]);
      }, 1000); // Simulate network latency
    });
  },

  addGoal: async (data: GoalFormData): Promise<Goal> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newGoal: Goal = {
          ...data,
          id: Math.random().toString(36).substring(7),
          currentAmount: 0,
          createdAt: new Date().toISOString(),
        };
        MOCK_GOALS = [newGoal, ...MOCK_GOALS];
        resolve(newGoal);
      }, 800);
    });
  },
};
