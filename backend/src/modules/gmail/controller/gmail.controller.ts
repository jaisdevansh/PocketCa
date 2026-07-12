import { FastifyRequest, FastifyReply } from 'fastify';
import { GmailOAuth } from '../oauth/gmail.oauth';
import { db } from '../../../database/connection/database';
import { emailConnections } from '../../../database/schema/parsers';
import { eq } from 'drizzle-orm';
import { gmailSyncQueue } from '../workers/queue.provider';

export class GmailController {
  async connect(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const authUrl = GmailOAuth.getAuthUrl(userId);
    return reply.send({ url: authUrl });
  }

  async callback(request: FastifyRequest, reply: FastifyReply) {
    const { code, state: userId } = request.body as { code: string; state: string };
    
    try {
      const tokens = await GmailOAuth.getTokensFromCode(code);
      if (!tokens.access_token || !tokens.refresh_token) {
        return reply.status(400).send({ error: 'Failed to retrieve proper tokens from Google' });
      }

      const emailAddress = await GmailOAuth.getUserProfile(tokens.access_token);
      if (!emailAddress) {
        return reply.status(400).send({ error: 'Failed to retrieve email address from Google' });
      }

      // Save to database
      const existing = await db.select().from(emailConnections)
        .where(eq(emailConnections.userId, userId))
        .limit(1);

      let connectionId: string;

      if (existing.length > 0 && existing[0].emailAddress === emailAddress) {
        // Update existing connection
        const updated = await db.update(emailConnections).set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          status: 'ACTIVE',
        }).where(eq(emailConnections.id, existing[0].id)).returning();
        connectionId = updated[0].id;
      } else {
        const inserted = await db.insert(emailConnections).values({
          userId,
          provider: 'GMAIL',
          emailAddress,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        }).returning();
        connectionId = inserted[0].id;
      }

      // Automatically queue a sync
      await gmailSyncQueue.add('initial-sync', { connectionId });

      return reply.send({ success: true, message: 'Gmail connected successfully', emailAddress });

    } catch (error) {
      console.error('Gmail OAuth Callback Error', error);
      return reply.status(500).send({ error: 'Internal server error during Gmail auth' });
    }
  }

  async sync(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const connections = await db.select().from(emailConnections).where(eq(emailConnections.userId, userId));
    
    if (connections.length === 0) {
      return reply.status(404).send({ error: 'No Gmail connections found' });
    }

    for (const connection of connections) {
      await gmailSyncQueue.add('manual-sync', { connectionId: connection.id });
    }

    return reply.send({ success: true, message: 'Sync started' });
  }

  async disconnect(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    await db.update(emailConnections).set({ status: 'DISCONNECTED', accessToken: null, refreshToken: null }).where(eq(emailConnections.userId, userId));
    return reply.send({ success: true, message: 'Gmail disconnected' });
  }
}

export const gmailController = new GmailController();
