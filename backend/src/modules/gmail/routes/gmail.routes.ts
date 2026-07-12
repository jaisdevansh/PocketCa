import { FastifyInstance } from 'fastify';
import { gmailController } from '../controller/gmail.controller';
import { connectGmailDto, callbackGmailDto } from '../dto/gmail.dto';

export default async function gmailRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.post('/connect', {
    schema: {
      tags: ['Gmail'],
      summary: 'Get OAuth URL to connect Gmail',
    },
    handler: gmailController.connect,
  });

  fastify.post('/callback', {
    schema: {
      tags: ['Gmail'],
      summary: 'Exchange OAuth code for tokens',
      body: callbackGmailDto,
    },
    handler: gmailController.callback,
  });

  fastify.post('/sync', {
    schema: {
      tags: ['Gmail'],
      summary: 'Trigger manual sync for all connected Gmail accounts',
    },
    handler: gmailController.sync,
  });

  fastify.post('/disconnect', {
    schema: {
      tags: ['Gmail'],
      summary: 'Disconnect Gmail and remove tokens',
    },
    handler: gmailController.disconnect,
  });
}
