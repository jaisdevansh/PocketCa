import { FastifyRequest, FastifyReply } from 'fastify';
import { SmsService } from '../service/sms.service';
import { SmsSyncDto } from '../dto/sms.dto';
import { sendSuccess } from '../../../utils/response.util';

export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  sync = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as SmsSyncDto;
    const result = await this.smsService.syncMessages(data, request);
    return sendSuccess(request, reply, result, 'SMS sync initiated. Messages queued for parsing.', {}, 202);
  };
}
