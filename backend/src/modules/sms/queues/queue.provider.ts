import { Queue, Worker, Job } from 'bullmq';
import { redisConfig, sharedBullMqConnection as connection } from '../../../config/redis.config';
import { ParserFactory } from '../parser/factory';
import { DuplicateDetector } from '../parser/duplicate/duplicate.detector';
import { MerchantNormalizer } from '../parser/merchant/merchant.normalizer';
import { SMSMessage } from '../types/parser.types';
import { db } from '../../../database/connection/database';
import { transactions } from '../../../database/schema/transactions';
import { smsLogs, smsUnknown, smsFailures, smsDuplicate } from '../../../database/schema/parsers';
import { merchants } from '../../../database/schema/merchants';
import { eq } from 'drizzle-orm';

// --- Queues ---
export const smsParsingQueue = new Queue('sms-parsing', { connection });

// --- Workers ---
export const smsParsingWorker = new Worker(
  'sms-parsing',
  async (job: Job<{ sms: SMSMessage; userId: string; logId: string }>) => {
    const { sms, userId, logId } = job.data;
    
    try {
      const parsed = ParserFactory.parse(sms);

      if (!parsed) {
        await db.update(smsLogs).set({ status: 'IGNORED', processed: true }).where(eq(smsLogs.id, logId));
        return { status: 'IGNORED' };
      }

      if (parsed.isSpam) {
        await db.update(smsLogs).set({ status: 'IGNORED', processed: true }).where(eq(smsLogs.id, logId));
        return { status: 'SPAM' };
      }

      if (parsed.overallConfidence < 25) {
        await db.transaction(async (tx: any) => {
          await tx.update(smsLogs).set({ status: 'FAILED', processed: true }).where(eq(smsLogs.id, logId));
          await tx.insert(smsUnknown).values({
            smsId: logId,
            confidence: parsed.overallConfidence.toString(),
            reason: parsed.rejectReason || 'Low confidence parse',
            manualReviewRequired: true,
          });
        });
        return { status: 'LOW_CONFIDENCE' };
      }

      // Check Duplicates
      const isDuplicate = await DuplicateDetector.isDuplicateTransaction(userId, parsed);
      if (isDuplicate) {
        await db.transaction(async (tx: any) => {
          await tx.update(smsLogs).set({ status: 'DUPLICATE', processed: true }).where(eq(smsLogs.id, logId));
        });
        return { status: 'DUPLICATE' };
      }

      // Normalize Merchant
      const normalizedMerchant = await MerchantNormalizer.normalize(parsed.merchant.value);
      
      // Save Transaction
      await db.transaction(async (tx: any) => {
        let mId: string | null = null;
        if (normalizedMerchant.name) {
          const existingMerchant = await tx.select().from(merchants).where(eq(merchants.normalizedName, normalizedMerchant.name.toUpperCase())).limit(1);
          if (existingMerchant.length > 0) {
            mId = existingMerchant[0].id;
          } else {
            const newM = await tx.insert(merchants).values({
              displayName: normalizedMerchant.name,
              normalizedName: normalizedMerchant.name.toUpperCase(),
            }).returning({ id: merchants.id });
            mId = newM[0].id;
          }
        }

        await tx.insert(transactions).values({
          userId,
          amount: parsed.amount.value.toString(),
          currency: parsed.currency.value,
          type: parsed.transactionType.value,
          merchantId: mId,
          transactionDate: parsed.date.value,
          referenceNumber: parsed.referenceNumber?.value,
          accountLastFourDigits: parsed.accountLastFour?.value,
          status: 'COMPLETED',
          source: 'SMS',
          rawMetadata: {
             paymentMethod: parsed.paymentMethod?.value,
             notes: `Parsed by ${parsed.parserVersion} (Conf: ${parsed.overallConfidence}%)`
          },
        });

        await tx.update(smsLogs)
          .set({ status: 'PROCESSED', processed: true, confidence: parsed.overallConfidence.toString(), parserVersion: parsed.parserVersion })
          .where(eq(smsLogs.id, logId));
      });

      return { status: 'PROCESSED' };

    } catch (error) {
      console.error('SMS Parsing Error', { error, smsId: logId });
      await db.transaction(async (tx: any) => {
        await tx.update(smsLogs).set({ status: 'FAILED', processed: true }).where(eq(smsLogs.id, logId));
        await tx.insert(smsFailures).values({
          smsId: logId,
          reason: (error as Error).message,
        });
      });
      throw error;
    }
  },
  { connection, concurrency: 10, stalledInterval: 300000, drainDelay: 15000 }
);

smsParsingWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
