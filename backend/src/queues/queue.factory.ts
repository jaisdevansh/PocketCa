import { Queue } from 'bullmq';
import { redisConfig, sharedBullMqConnection as connection } from '../config/redis.config';
import { logger } from '../utils/logger';

// All independent queues as per architecture
export const QUEUE_NAMES = {
  SMS: 'sms-queue',
  GMAIL: 'gmail-queue',
  TRANSACTION: 'transaction-queue',
  MERCHANT: 'merchant-queue',
  ANALYTICS: 'analytics-queue',
  BUDGET: 'budget-queue',
  GOAL: 'goal-queue',
  SUBSCRIPTION: 'subscription-queue',
  NOTIFICATION: 'notification-queue',
  REPORT: 'report-queue',
  AI: 'ai-queue',
  RETRY: 'retry-queue',
  CLEANUP: 'cleanup-queue',
  EXPORT: 'export-queue',
  AUDIT: 'audit-queue',
};

class QueueFactory {
  private queues: Map<string, Queue> = new Map();

  constructor() {
    this.initializeQueues();
  }

  private initializeQueues() {
    Object.values(QUEUE_NAMES).forEach(queueName => {
      const queue = new Queue(queueName, { 
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: 100, // Keep last 100 successful jobs
          removeOnFail: 1000,    // Keep last 1000 failed jobs for debugging
        }
      });

      queue.on('error', (err) => {
        logger.error(`BullMQ Error in ${queueName}:`, err);
      });

      this.queues.set(queueName, queue);
    });
    
    logger.info(`Initialized ${this.queues.size} BullMQ Queues`);
  }

  public getQueue(name: string): Queue {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} is not initialized`);
    }
    return queue;
  }
}

export const queueFactory = new QueueFactory();
