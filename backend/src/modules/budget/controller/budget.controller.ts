import { FastifyRequest, FastifyReply } from 'fastify';
import { budgetService } from '../service/budget.service';
import { db } from '../../../database/connection/database';
import { budgets } from '../../../database/schema/budgets';
import { eq, and } from 'drizzle-orm';

export class BudgetController {
  async getBudgets(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const records = await budgetService.getBudgets(userId);
    return reply.send({ data: records });
  }

  async createBudget(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const record = await budgetService.createBudget(userId, request.body);
    return reply.status(201).send({ data: record });
  }

  async deleteBudget(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { id } = request.params;
    
    await db.delete(budgets).where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
    return reply.status(204).send();
  }
}

export const budgetController = new BudgetController();
