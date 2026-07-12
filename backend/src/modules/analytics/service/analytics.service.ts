import { db } from '../../../database/connection/database';
import { dailyStatistics, monthlyStatistics } from '../../../database/schema/analytics';
import { eq, and } from 'drizzle-orm';

export class AnalyticsService {
  async processTransactionForAnalytics(payload: { transactionId: string; userId: string; amount: number; categoryId?: string; merchantId?: string }) {
    const { userId, amount } = payload;
    
    // Simplistic approach for MVP: positive amount = expense, negative = income
    const isExpense = amount > 0;
    const absAmount = Math.abs(amount);
    
    const now = new Date();
    const statDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const statMonth = statDate.substring(0, 7); // YYYY-MM

    await db.transaction(async (tx: any) => {
      // Daily Stats Update
      const daily = await tx.select().from(dailyStatistics)
        .where(and(eq(dailyStatistics.userId, userId), eq(dailyStatistics.statDate, statDate)))
        .limit(1);

      if (daily.length > 0) {
        const d = daily[0];
        const newExpense = isExpense ? parseFloat(d.totalExpense) + absAmount : parseFloat(d.totalExpense);
        const newIncome = !isExpense ? parseFloat(d.totalIncome) + absAmount : parseFloat(d.totalIncome);
        await tx.update(dailyStatistics).set({
          totalExpense: newExpense.toString(),
          totalIncome: newIncome.toString(),
          transactionCount: d.transactionCount + 1,
        }).where(eq(dailyStatistics.id, d.id));
      } else {
        await tx.insert(dailyStatistics).values({
          userId,
          statDate,
          totalExpense: isExpense ? absAmount.toString() : '0',
          totalIncome: !isExpense ? absAmount.toString() : '0',
          transactionCount: 1,
        });
      }

      // Monthly Stats Update
      const monthly = await tx.select().from(monthlyStatistics)
        .where(and(eq(monthlyStatistics.userId, userId), eq(monthlyStatistics.statMonth, statMonth)))
        .limit(1);

      if (monthly.length > 0) {
        const m = monthly[0];
        const newExpense = isExpense ? parseFloat(m.totalExpense) + absAmount : parseFloat(m.totalExpense);
        const newIncome = !isExpense ? parseFloat(m.totalIncome) + absAmount : parseFloat(m.totalIncome);
        await tx.update(monthlyStatistics).set({
          totalExpense: newExpense.toString(),
          totalIncome: newIncome.toString(),
          transactionCount: m.transactionCount + 1,
        }).where(eq(monthlyStatistics.id, m.id));
      } else {
        await tx.insert(monthlyStatistics).values({
          userId,
          statMonth,
          totalExpense: isExpense ? absAmount.toString() : '0',
          totalIncome: !isExpense ? absAmount.toString() : '0',
          transactionCount: 1,
        });
      }
    });
  }

  async getDashboardStats(userId: string) {
    const statMonth = new Date().toISOString().substring(0, 7);
    const monthly = await db.select().from(monthlyStatistics)
        .where(and(eq(monthlyStatistics.userId, userId), eq(monthlyStatistics.statMonth, statMonth)))
        .limit(1);

    if (monthly.length > 0) {
      return {
        totalExpense: parseFloat(monthly[0].totalExpense || '0'),
        totalIncome: parseFloat(monthly[0].totalIncome || '0'),
        transactionCount: monthly[0].transactionCount,
      };
    }
    return { totalExpense: 0, totalIncome: 0, transactionCount: 0 };
  }
}

export const analyticsService = new AnalyticsService();
