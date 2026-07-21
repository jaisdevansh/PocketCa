import { Worker, Job } from 'bullmq';
import { redisConfig, sharedBullMqConnection as connection } from '../config/redis.config';
import { QUEUE_NAMES } from '../queues/queue.factory';
import { db } from '../database/connection/database';
import { notifications, notificationHistory } from '../database/schema/system';
import { logger } from '../utils/logger';
import { eventBus } from '../events/event.bus';

export const notificationWorker = new Worker(
  QUEUE_NAMES.NOTIFICATION,
  async (job: Job) => {
    logger.info(`Processing notification job ${job.id}`);
    const { userId, title, body, type, actionUrl, deliveryMethods } = job.data;

    try {
      // 1. Store Notification in DB
      const [notification] = await db.insert(notifications).values({
        userId,
        title,
        body,
        type,
        actionUrl,
      }).returning();

      // 2. Dispatch to requested channels
      // In a real implementation, we would call external APIs (FCM, AWS SES, Twilio)
      const methods: string[] = deliveryMethods || ['IN_APP'];

      for (const method of methods) {
        let status = 'SENT';
        let errorDetails = null;

        try {
          if (method === 'PUSH') {
            // Mock Push Delivery
            logger.info(`[MOCK] Sending Push to User ${userId}: ${title}`);
          } else if (method === 'EMAIL') {
            // Mock Email Delivery
            logger.info(`[MOCK] Sending Email to User ${userId}: ${title}`);
          }
        } catch (deliveryError: any) {
          status = 'FAILED';
          errorDetails = deliveryError.message;
        }

        await db.insert(notificationHistory).values({
          notificationId: notification.id,
          deliveryMethod: method,
          status,
          errorDetails,
        });
      }

      // Emit event so other systems know notification is complete
      eventBus.publish('NotificationCreated', {
        notificationId: notification.id,
        userId,
        type
      });

    } catch (error) {
      logger.error('Failed to process notification', error);
      throw error;
    }
  },
  { connection, concurrency: 10, stalledInterval: 300000, drainDelay: 15000 }
);

notificationWorker.on('failed', (job, err) => {
  if (job) {
    logger.error(`Notification Job ${job.id} failed:`, err);
  }
});
