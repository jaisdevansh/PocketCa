import { FastifyRequest } from 'fastify';
import { SmsSyncDto } from '../dto/sms.dto';
import { smsParsingQueue } from '../queues/queue.provider';
import { db } from '../../../database/connection/database';
import { smsLogs } from '../../../database/schema/parsers';
import { DuplicateDetector } from '../parser/duplicate/duplicate.detector';

export class SmsService {
  /**
   * Syncs raw SMS messages from the device, deduplicates them at the raw text level,
   * stores them in smsLogs, and dispatches to BullMQ.
   */
  async syncMessages(data: SmsSyncDto, request: FastifyRequest) {
    const userId = (request.user as any).id;
    let queued = 0;
    let skipped = 0;

    for (const msg of data.messages) {
      const hash = DuplicateDetector.generateHash(msg.sender, msg.body);
      
      // 1. Raw SMS deduplication using the hash
      // In production with massive batch size, this should be done with `onConflictDoNothing`
      try {
        const [log] = await db.insert(smsLogs).values({
          userId,
          hash,
          sender: msg.sender,
          rawContent: msg.body,
          status: 'PENDING',
        }).returning({ id: smsLogs.id });

        // 2. Dispatch to Queue
        await smsParsingQueue.add('parse-sms', {
          userId,
          logId: log.id,
          sms: {
            id: msg.id,
            sender: msg.sender,
            body: msg.body,
            receivedAt: new Date(msg.receivedAt),
            hash,
          }
        });
        queued++;
      } catch (err: any) {
        if (err.code === '23505') { // Postgres Unique Violation
          skipped++;
        } else {
          throw err;
        }
      }
    }

    return { queued, skipped };
  }
}
