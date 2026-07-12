import { db } from '../../../database/connection/database';
import { budgets, budgetHistory } from '../../../database/schema/budgets';
import { eq, and, sql, isNull } from 'drizzle-orm';

export class BudgetService {
  /**
   * Process a transaction to update budget history.
   * This is called asynchronously via BullMQ worker.
   */
  async processTransactionForBudget(payload: { transactionId: string; userId: string; amount: number; categoryId?: string; merchantId?: string }) {
    const { userId, amount, categoryId, merchantId } = payload;

    // We only deduct from budgets for Expenses (assuming amount > 0 means expense in this payload context, or we can just deduct unconditionally based on transaction type. For now, assuming positive amount = spent).
    
    // Find active budgets for this user that match the category or merchant, or overall budgets (where category and merchant are null)
    let conditions = [];
    if (categoryId) conditions.push(eq(budgets.categoryId, categoryId));
    if (merchantId) conditions.push(eq(budgets.merchantId, merchantId));
    conditions.push(and(isNull(budgets.categoryId), isNull(budgets.merchantId))); // Overall budget

    // We need an OR condition for the above, but drizzle or() requires array.
    // For simplicity, we just fetch all active budgets for the user and filter in memory.
    const activeBudgets = await db.select().from(budgets).where(and(eq(budgets.userId, userId), eq(budgets.active, true)));

    const matchingBudgets = activeBudgets.filter(b => {
      if (b.categoryId === categoryId) return true;
      if (b.merchantId === merchantId) return true;
      if (!b.categoryId && !b.merchantId) return true; // Matches overall budget
      return false;
    });

    const now = new Date();

    for (const budget of matchingBudgets) {
      // Find the current period history (e.g., current month)
      // This is a simplified check. A production app would rigorously check periodStart and periodEnd based on budget.period
      const currentHistory = await db.select().from(budgetHistory)
        .where(and(
          eq(budgetHistory.budgetId, budget.id),
          sql`${budgetHistory.periodStart} <= ${now.toISOString()}`,
          sql`${budgetHistory.periodEnd} >= ${now.toISOString()}`
        ))
        .limit(1);

      if (currentHistory.length > 0) {
        const historyId = currentHistory[0].id;
        const newSpent = parseFloat(currentHistory[0].amountSpent || '0') + amount;
        const exceeded = newSpent > parseFloat(budget.amount);

        await db.update(budgetHistory)
          .set({ amountSpent: newSpent.toString(), exceeded })
          .where(eq(budgetHistory.id, historyId));
      } else {
        // Create new history if autoReset is true
        if (budget.autoReset) {
          const newSpent = amount;
          const exceeded = newSpent > parseFloat(budget.amount);
          
          // Determine period boundaries (assuming monthly for now)
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

          await db.insert(budgetHistory).values({
            budgetId: budget.id,
            periodStart: start,
            periodEnd: end,
            amountBudgeted: budget.amount,
            amountSpent: newSpent.toString(),
            exceeded,
          });
        }
      }
    }
  }

  async getBudgets(userId: string) {
    return await db.select().from(budgets).where(eq(budgets.userId, userId));
  }

  async createBudget(userId: string, data: any) {
    const inserted = await db.insert(budgets).values({
      userId,
      ...data,
    }).returning();
    return inserted[0];
  }
}

export const budgetService = new BudgetService();
