import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { SmsController } from '../controller/sms.controller';
import { SmsService } from '../service/sms.service';
import { smsSyncSchema } from '../dto/sms.dto';

const smsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = new SmsService();
  const controller = new SmsController(service);

  // Note: auth middleware will be applied either globally or here depending on structure.
  // Assuming `requireAuth` is a preHandler decorator configured in jwt plugin
  
  fastify.withTypeProvider<ZodTypeProvider>().post('/sync', {
    preValidation: [fastify.authenticate], // Using the authenticate decorator from Part 4
    schema: {
      tags: ['SMS'],
      summary: 'Sync Bulk SMS',
      description: 'Upload array of SMS to be processed in background queues',
      body: smsSyncSchema,
    }
  }, controller.sync);
};

export default smsRoutes;
