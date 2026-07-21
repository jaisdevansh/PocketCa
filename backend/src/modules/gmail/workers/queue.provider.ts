import { Queue, Worker, Job } from 'bullmq';
import { redisConfig, sharedBullMqConnection as connection } from '../../../config/redis.config';
import { gmailSync } from '../sync/gmail.sync';
import { emailParsingService } from '../service/gmail-parsing.service';

// --- Queues ---
export const gmailSyncQueue = new Queue('gmail-sync', { connection });
export const gmailParsingQueue = new Queue('gmail-parsing', { connection });

// --- Workers ---

// Worker for fetching emails from Gmail incrementally
export const gmailSyncWorker = new Worker(
  'gmail-sync',
  async (job: Job<{ connectionId: string }>) => {
    const { connectionId } = job.data;
    await gmailSync(connectionId);
  },
  { connection, concurrency: 5, stalledInterval: 300000, drainDelay: 15000 }
);

gmailSyncWorker.on('failed', (job, err) => {
  console.error(`Sync Job ${job?.id} failed with error ${err.message}`);
});

export const gmailParsingWorker = new Worker(
  'gmail-parsing',
  async (job: Job<{ logId: string; messageId: string; connectionId: string }>) => {
    await emailParsingService.parseEmailJob(job.data.logId, job.data.messageId, job.data.connectionId);
  },
  { connection, concurrency: 10, stalledInterval: 300000, drainDelay: 15000 }
);

gmailParsingWorker.on('failed', (job, err) => {
  console.error(`Parsing Job ${job?.id} failed with error ${err.message}`);
});

