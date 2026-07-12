import { FastifyInstance } from 'fastify';
import { goalController } from '../controller/goal.controller';

export default async function goalRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    schema: { tags: ['Goals'], summary: 'Get all user goals' },
    handler: goalController.getGoals,
  });

  fastify.post('/', {
    schema: { tags: ['Goals'], summary: 'Create a new goal' },
    handler: goalController.createGoal,
  });

  fastify.delete('/:id', {
    schema: { tags: ['Goals'], summary: 'Delete a goal' },
    handler: goalController.deleteGoal,
  });
}
