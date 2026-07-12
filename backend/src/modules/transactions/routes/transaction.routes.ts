import { FastifyInstance } from 'fastify';
import { transactionController } from '../controller/transaction.controller';
import { createTransactionDto, updateTransactionDto } from '../dto/transaction.dto';
import { z } from 'zod';

export default async function transactionRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    schema: {
      tags: ['Transactions'],
      summary: 'Get all user transactions',
    },
    handler: transactionController.getTransactions,
  });

  fastify.get('/:id', {
    schema: {
      tags: ['Transactions'],
      summary: 'Get a specific transaction',
      params: z.object({ id: z.string().uuid() }),
    },
    handler: transactionController.getTransactionById,
  });

  fastify.post('/', {
    schema: {
      tags: ['Transactions'],
      summary: 'Create a new transaction manually',
      body: createTransactionDto,
    },
    handler: transactionController.createTransaction,
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['Transactions'],
      summary: 'Update a transaction',
      params: z.object({ id: z.string().uuid() }),
      body: updateTransactionDto,
    },
    handler: transactionController.updateTransaction,
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['Transactions'],
      summary: 'Delete a transaction',
      params: z.object({ id: z.string().uuid() }),
    },
    handler: transactionController.deleteTransaction,
  });
}
