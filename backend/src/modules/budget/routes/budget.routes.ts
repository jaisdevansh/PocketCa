import { FastifyInstance } from 'fastify';
import { budgetController } from '../controller/budget.controller';

export default async function budgetRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    schema: { tags: ['Budgets'], summary: 'Get all user budgets' },
    handler: budgetController.getBudgets,
  });

  fastify.post('/', {
    schema: { tags: ['Budgets'], summary: 'Create a new budget' },
    handler: budgetController.createBudget,
  });

  fastify.delete('/:id', {
    schema: { tags: ['Budgets'], summary: 'Delete a budget' },
    handler: budgetController.deleteBudget,
  });
}
