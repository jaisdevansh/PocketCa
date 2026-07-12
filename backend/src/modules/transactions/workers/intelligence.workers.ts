import { Worker, Job } from 'bullmq';
import { redisConfig, sharedBullMqConnection as connection } from '../../../config/redis.config';
import { budgetService } from '../../budget/service/budget.service';
import { goalService } from '../../goal/service/goal.service';
import { analyticsService } from '../../analytics/service/analytics.service';

export const budgetWorker = new Worker(
  'budget-updates',
  async (job: Job) => {
    await budgetService.processTransactionForBudget(job.data);
  },
  { connection }
);

export const goalWorker = new Worker(
  'goal-updates',
  async (job: Job) => {
    await goalService.processTransactionForGoal(job.data);
  },
  { connection }
);

export const analyticsWorker = new Worker(
  'analytics-updates',
  async (job: Job) => {
    await analyticsService.processTransactionForAnalytics(job.data);
  },
  { connection }
);
