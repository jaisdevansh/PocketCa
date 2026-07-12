import EventEmitter from 'events';
import { transactionQueueProvider } from '../workers/queue.provider';

export const TransactionEvents = new EventEmitter();

// When a new transaction is processed and saved in the DB, we fire this event.
TransactionEvents.on('TRANSACTION_CREATED', async (payload: { transactionId: string; userId: string; amount: number; categoryId?: string; merchantId?: string }) => {
  // Fire async workers to do budget and goal intelligence
  await transactionQueueProvider.addBudgetJob(payload);
  await transactionQueueProvider.addGoalJob(payload);
  await transactionQueueProvider.addAnalyticsJob(payload);
});
