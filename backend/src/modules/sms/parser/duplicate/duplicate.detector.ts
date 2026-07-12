import { ParsedTransaction } from '../../types/parser.types';
import { db } from '../../../../database/connection/database';
import { transactions } from '../../../../database/schema/transactions';
import { eq, and, gte, lte } from 'drizzle-orm';
import { createHash } from 'crypto';

export class DuplicateDetector {
  /**
   * Checks if an exact same SMS has already been processed based on the hash of the raw text and sender
   */
  static generateHash(sender: string, rawContent: string): string {
    return createHash('sha256').update(`${sender}:${rawContent}`).digest('hex');
  }

  /**
   * Checks for fuzzy duplicates (e.g. same amount, merchant, and time window)
   * This is critical because some banks send multiple SMS for the same transaction
   */
  static async isDuplicateTransaction(userId: string, parsed: ParsedTransaction): Promise<boolean> {
    if (parsed.isSpam) return false;

    // Buffer window of 5 minutes to catch duplicate SMS for the same transaction
    const timeWindow = 5 * 60 * 1000; 
    const minTime = new Date(parsed.date.value.getTime() - timeWindow);
    const maxTime = new Date(parsed.date.value.getTime() + timeWindow);

    const possibleDuplicates = await db.select().from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.amount, parsed.amount.value.toString()),
          eq(transactions.type, parsed.transactionType.value),
          gte(transactions.transactionDate, minTime),
          lte(transactions.transactionDate, maxTime)
        )
      );

    // Checking fuzzy merchant matches in a real system requires loading the merchant names.
    // For now we just return true if the amount and time matches and there's a reference number match
    for (const txn of possibleDuplicates) {
      if (parsed.referenceNumber && txn.referenceNumber === parsed.referenceNumber.value) {
        return true;
      }
    }

    return false;
  }
}
