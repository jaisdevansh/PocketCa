import { FastifyRequest, FastifyReply } from 'fastify';
import { transactionService } from '../service/transaction.service';
import { CreateTransactionInput, UpdateTransactionInput } from '../dto/transaction.dto';
import { db } from '../../../database/connection/database';
import { transactions } from '../../../database/schema/transactions';
import { eq, and } from 'drizzle-orm';

export class TransactionController {
  async getTransactions(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const records = await transactionService.getTransactions(userId);
    return reply.send({ data: records });
  }

  async getTransactionById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { id } = request.params;
    const records = await db.select().from(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId))).limit(1);
    
    if (!records.length) return reply.status(404).send({ error: 'Transaction not found' });
    return reply.send({ data: records[0] });
  }

  async createTransaction(request: FastifyRequest<{ Body: CreateTransactionInput }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    try {
      const record = await transactionService.processIncomingTransaction(userId, request.body);
      return reply.status(201).send({ data: record });
    } catch (error: any) {
      if (error.message === 'Duplicate transaction detected') {
        return reply.status(409).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Failed to create transaction' });
    }
  }

  async updateTransaction(request: FastifyRequest<{ Params: { id: string }; Body: UpdateTransactionInput }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { id } = request.params;
    
    const records = await db.select().from(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId))).limit(1);
    if (!records.length) return reply.status(404).send({ error: 'Transaction not found' });

    const updated = await db.update(transactions)
      .set(request.body)
      .where(eq(transactions.id, id))
      .returning();

    return reply.send({ data: updated[0] });
  }

  async deleteTransaction(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { id } = request.params;
    
    const records = await db.select().from(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId))).limit(1);
    if (!records.length) return reply.status(404).send({ error: 'Transaction not found' });

    await db.delete(transactions).where(eq(transactions.id, id));
    return reply.status(204).send();
  }
}

export const transactionController = new TransactionController();
