import { queueFactory, QUEUE_NAMES } from '../queues/queue.factory';
import { logger } from '../utils/logger';

class NightlyScheduler {
  async init() {
    try {
      const analyticsQueue = queueFactory.getQueue(QUEUE_NAMES.ANALYTICS);
      const reportQueue = queueFactory.getQueue(QUEUE_NAMES.REPORT);
      const cleanupQueue = queueFactory.getQueue(QUEUE_NAMES.CLEANUP);

      // Remove existing repeatable jobs to avoid duplicates if schedule changes
      await this.clearRepeatableJobs(analyticsQueue);
      await this.clearRepeatableJobs(reportQueue);
      await this.clearRepeatableJobs(cleanupQueue);

      // Nightly Analytics (Runs every day at Midnight UTC)
      await analyticsQueue.add('nightly-analytics-rollup', {}, {
        repeat: {
          pattern: '0 0 * * *'
        }
      });

      // Monthly Reports (Runs on the 1st of every month at 1:00 AM UTC)
      await reportQueue.add('monthly-report-generation', {}, {
        repeat: {
          pattern: '0 1 1 * *'
        }
      });

      // Weekly Reports (Runs every Sunday at 1:00 AM UTC)
      await reportQueue.add('weekly-report-generation', {}, {
        repeat: {
          pattern: '0 1 * * 0'
        }
      });

      // Cache & Session Cleanup (Runs every day at 2:00 AM UTC)
      await cleanupQueue.add('daily-cleanup', {}, {
        repeat: {
          pattern: '0 2 * * *'
        }
      });

      logger.info('Nightly Schedulers Initialized');
    } catch (error) {
      logger.error('Failed to initialize Nightly Schedulers', error);
    }
  }

  private async clearRepeatableJobs(queue: any) {
    const repeatableJobs = await queue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await queue.removeRepeatableByKey(job.key);
    }
  }
}

export const nightlyScheduler = new NightlyScheduler();
