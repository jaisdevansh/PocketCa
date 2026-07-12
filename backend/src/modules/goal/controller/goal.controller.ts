import { FastifyRequest, FastifyReply } from 'fastify';
import { goalService } from '../service/goal.service';
import { db } from '../../../database/connection/database';
import { goals } from '../../../database/schema/goals';
import { eq, and } from 'drizzle-orm';

export class GoalController {
  async getGoals(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const records = await goalService.getGoals(userId);
    return reply.send({ data: records });
  }

  async createGoal(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const record = await goalService.createGoal(userId, request.body);
    return reply.status(201).send({ data: record });
  }

  async deleteGoal(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { id } = request.params;
    
    await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    return reply.status(204).send();
  }
}

export const goalController = new GoalController();
