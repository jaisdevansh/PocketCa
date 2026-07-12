import { FastifyReply, FastifyRequest } from 'fastify';
import { healthService } from './health.service';
import { sendSuccess } from '../../utils/response.util';

export class HealthController {
  public async checkHealth(request: FastifyRequest, reply: FastifyReply) {
    const healthStatus = await healthService.checkHealth();
    return sendSuccess(request, reply, healthStatus, 'System is operating normally');
  }
}

export const healthController = new HealthController();
