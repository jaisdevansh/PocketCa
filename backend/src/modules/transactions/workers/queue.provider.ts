import { Queue, Worker, Job } from 'bullmq';
import { redisConfig, sharedBullMqConnection as connection } from '../../../config/redis.config';

class TransactionQueueProvider {
  public budgetQueue = new Queue('budget-updates', { connection });
  public goalQueue = new Queue('goal-updates', { connection });
  public analyticsQueue = new Queue('analytics-updates', { connection });

  async addBudgetJob(payload: any) {
    await this.budgetQueue.add('update-budget', payload);
  }

  async addGoalJob(payload: any) {
    await this.goalQueue.add('update-goal', payload);
  }

  async addAnalyticsJob(payload: any) {
    await this.analyticsQueue.add('update-analytics', payload);
  }
}

export const transactionQueueProvider = new TransactionQueueProvider();

// The workers will be defined and registered in their respective modules.
