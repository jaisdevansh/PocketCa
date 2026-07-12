import { db } from '../../../database/connection/database';
import { goals, goalHistory } from '../../../database/schema/goals';
import { eq } from 'drizzle-orm';

export class GoalService {
  /**
   * Process a transaction to update goal progress.
   * This is called asynchronously via BullMQ worker.
   */
  async processTransactionForGoal(payload: { transactionId: string; userId: string; amount: number; categoryId?: string; merchantId?: string }) {
    const { userId, amount, transactionId } = payload;

    // For goals, we might identify transactions tagged with a specific goal category (e.g. "Savings" or a specific Goal ID in the future).
    // For now, this is a placeholder implementation that doesn't blindly apply all expenses to goals,
    // but rather it would check if the transaction is a transfer to a goal account.
    
    // Example: if category is 'Savings', distribute amount to active goals or specific goal.
    // Real implementation would link transaction to goalId directly via an intermediary table.
  }

  async getGoals(userId: string) {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async createGoal(userId: string, data: any) {
    const inserted = await db.insert(goals).values({
      userId,
      ...data,
    }).returning();
    return inserted[0];
  }

  async addContribution(userId: string, goalId: string, amount: number, notes?: string) {
    const goalRecords = await db.select().from(goals).where(eq(goals.id, goalId)).limit(1);
    if (!goalRecords.length) throw new Error('Goal not found');
    const goal = goalRecords[0];

    const newAmount = parseFloat(goal.currentAmount) + amount;
    const status = newAmount >= parseFloat(goal.targetAmount) ? 'COMPLETED' : 'ACTIVE';

    await db.transaction(async (tx: any) => {
      await tx.insert(goalHistory).values({
        goalId,
        amountAdded: amount.toString(),
        notes,
      });

      await tx.update(goals).set({
        currentAmount: newAmount.toString(),
        status,
        updatedAt: new Date().toISOString(),
      }).where(eq(goals.id, goalId));
    });

    return { success: true, newAmount, status };
  }
}

export const goalService = new GoalService();
