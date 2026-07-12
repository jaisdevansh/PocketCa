import { db } from '../../database/connection/database';
import { transactions } from '../../database/schema/transactions';
import { budgets } from '../../database/schema/budgets';
import { goals } from '../../database/schema/goals';
import { eq, and, sql } from 'drizzle-orm';
import { logger } from '../../utils/logger';

export class ContextEngine {
  /**
   * Compiles structured financial metrics (Income, Expenses, etc.) securely for AI usage.
   * Never passes raw PII, only aggregates or anonymized structured data.
   */
  async buildFinancialContext(userId: string, dateRange: { start: Date; end: Date }): Promise<Record<string, any>> {
    try {
      // 1. Get transaction aggregates
      const txns = await db.select().from(transactions)
        .where(and(
          eq(transactions.userId, userId),
          sql`${transactions.transactionDate} >= ${dateRange.start.toISOString()}`,
          sql`${transactions.transactionDate} <= ${dateRange.end.toISOString()}`
        ));

      let totalIncome = 0;
      let totalExpense = 0;
      const categoryBreakdown: Record<string, number> = {};

      for (const txn of txns) {
        const amt = parseFloat(txn.amount);
        if (txn.type === 'CREDIT') {
          totalIncome += amt;
        } else {
          totalExpense += amt;
          const cat = txn.categoryId || 'Uncategorized';
          categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + amt;
        }
      }

      // 2. Get active budgets
      const activeBudgets = await db.select({
        name: budgets.name,
        amount: budgets.amount,
      }).from(budgets).where(and(eq(budgets.userId, userId), eq(budgets.active, true)));

      // 3. Get active goals
      const activeGoals = await db.select({
        name: goals.name,
        targetAmount: goals.targetAmount,
        currentAmount: goals.currentAmount,
      }).from(goals).where(and(eq(goals.userId, userId), eq(goals.status, 'ACTIVE')));

      return {
        period: {
          start: dateRange.start.toISOString().split('T')[0],
          end: dateRange.end.toISOString().split('T')[0],
        },
        cashFlow: {
          totalIncome,
          totalExpense,
          net: totalIncome - totalExpense,
        },
        categoryBreakdown,
        budgets: activeBudgets,
        goals: activeGoals,
      };
    } catch (error) {
      logger.error('Error building context', error);
      throw error;
    }
  }
}

export const contextEngine = new ContextEngine();
