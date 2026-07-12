import { db } from '../../../database/connection/database';
import { auditLogs } from '../../../database/schema/system';
import { securityEvents } from '../../../database/schema/auth';
import { TransactionClient } from '../../../database/connection/transaction';
import { FastifyRequest } from 'fastify';

export class AuditService {
  static async logAction(
    tx: TransactionClient | typeof db,
    params: {
      userId?: string;
      action: string;
      entityType?: string;
      entityId?: string;
      oldValues?: any;
      newValues?: any;
      request?: FastifyRequest;
    }
  ) {
    await tx.insert(auditLogs).values({
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      oldValues: params.oldValues,
      newValues: params.newValues,
      ipAddress: params.request?.ip,
      userAgent: params.request?.headers['user-agent'],
    });
  }

  static async logSecurityEvent(
    tx: TransactionClient | typeof db,
    params: {
      userId?: string;
      eventType: string;
      metadata?: any;
      request?: FastifyRequest;
      deviceFingerprint?: string;
    }
  ) {
    await tx.insert(securityEvents).values({
      userId: params.userId,
      eventType: params.eventType,
      metadata: params.metadata,
      ipAddress: params.request?.ip,
      deviceFingerprint: params.deviceFingerprint,
    });
  }
}
