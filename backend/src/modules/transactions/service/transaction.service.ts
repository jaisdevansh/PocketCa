import { db } from '../../../database/connection/database';
import { transactions } from '../../../database/schema/transactions';
import { merchants } from '../../../database/schema/merchants';
import { eq } from 'drizzle-orm';
import { CreateTransactionInput } from '../dto/transaction.dto';
import { TransactionEvents } from '../events/transaction.events';
import { MerchantNormalizer } from '../../sms/parser/merchant/merchant.normalizer';
import { DuplicateDetector } from '../../sms/parser/duplicate/duplicate.detector';
import { createHash } from 'crypto';

export class TransactionService {
  /**
   * Universal entry point for any incoming transaction.
   * This handles normalisation, merchant resolution, duplicate checking, and storing.
   */
  async processIncomingTransaction(userId: string, data: CreateTransactionInput) {
    // 1. Duplicate hash generation
    const hashData = `${userId}:${data.amount}:${data.transactionDate}:${data.type}`;
    const hash = createHash('sha256').update(hashData).digest('hex');

    // 2. Duplicate Detection
    const existing = await db.select().from(transactions).where(eq(transactions.hash, hash)).limit(1);
    if (existing.length > 0) {
      throw new Error('Duplicate transaction detected');
    }

    // 3. Merchant Resolution
    let resolvedMerchantId = data.merchantId || null;
    let resolvedCategoryId = data.categoryId || null;

    if (!resolvedMerchantId && data.merchantName) {
      const normalized = await MerchantNormalizer.normalize(data.merchantName);
      if (normalized.isResolved) {
        // Find merchant in DB
        const existingMerchant = await db.select().from(merchants).where(eq(merchants.normalizedName, normalized.name.toUpperCase())).limit(1);
        if (existingMerchant.length > 0) {
          resolvedMerchantId = existingMerchant[0].id;
          if (!resolvedCategoryId && existingMerchant[0].categoryId) {
            resolvedCategoryId = existingMerchant[0].categoryId;
          }
        } else {
          // Create merchant
          const newMerchant = await db.insert(merchants).values({
            displayName: normalized.name,
            normalizedName: normalized.name.toUpperCase(),
          }).returning({ id: merchants.id, categoryId: merchants.categoryId });
          resolvedMerchantId = newMerchant[0].id;
          resolvedCategoryId = newMerchant[0].categoryId;
        }
      }
    }

    // 4. Save Transaction
    const inserted = await db.insert(transactions).values({
      userId,
      source: data.source,
      amount: data.amount.toString(),
      currency: data.currency,
      type: data.type,
      merchantId: resolvedMerchantId,
      categoryId: resolvedCategoryId,
      bankId: data.bankId,
      accountLastFourDigits: data.accountLastFourDigits,
      referenceNumber: data.referenceNumber,
      balance: data.balance?.toString(),
      transactionDate: new Date(data.transactionDate),
      description: data.description,
      hash,
      rawMetadata: data.rawMetadata,
      status: 'COMPLETED',
    }).returning();

    // 5. Fire Events for Background Intelligence
    TransactionEvents.emit('TRANSACTION_CREATED', {
      transactionId: inserted[0].id,
      userId,
      amount: data.amount,
      categoryId: resolvedCategoryId,
      merchantId: resolvedMerchantId,
    });

    return inserted[0];
  }

  async getTransactions(userId: string) {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }
}

export const transactionService = new TransactionService();
