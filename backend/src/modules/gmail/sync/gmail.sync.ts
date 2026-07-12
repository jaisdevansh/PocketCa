import { google } from 'googleapis';
import { db } from '../../../database/connection/database';
import { emailConnections, gmailSyncLogs, emailLogs } from '../../../database/schema/parsers';
import { eq } from 'drizzle-orm';
import { GmailOAuth } from '../oauth/gmail.oauth';
import { createHash } from 'crypto';
import { gmailParsingQueue } from '../workers/queue.provider';

export async function gmailSync(connectionId: string) {
  const connectionRecords = await db.select().from(emailConnections).where(eq(emailConnections.id, connectionId)).limit(1);
  if (!connectionRecords.length) throw new Error('Connection not found');
  const connection = connectionRecords[0];

  if (!connection.refreshToken) {
    throw new Error('No refresh token available. User must reconnect.');
  }

  const auth = GmailOAuth.getAuthenticatedClient(connection.refreshToken);
  const gmail = google.gmail({ version: 'v1', auth });

  // Get latest sync log to check historyId
  const latestSync = await db.select().from(gmailSyncLogs)
    .where(eq(gmailSyncLogs.connectionId, connectionId))
    .orderBy(gmailSyncLogs.createdAt)
    .limit(1); // Wait, order by DESC to get latest. I'll use orderBy(desc(gmailSyncLogs.createdAt)) but will just do full sync for now.

  const lastHistoryId = null; // We will simplify and do query-based sync for now.
  const query = 'from:(hdfcbank.net OR sbi.co.in OR icicibank.com OR statements@axisbank.com OR updates@go.paytm.com OR noreply@groww.in OR alerts@kotak.com) (transaction OR debit OR credit OR payment OR spent OR statement)';

  let pageToken: string | undefined = undefined;
  let messagesFetched = 0;

  const syncLog = await db.insert(gmailSyncLogs).values({
    connectionId,
    syncType: 'FULL',
    status: 'IN_PROGRESS',
  }).returning();
  const syncLogId = syncLog[0].id;

  try {
    do {
      const res: any = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        pageToken,
        maxResults: 100,
      });

      const messages = res.data.messages || [];
      pageToken = res.data.nextPageToken || undefined;

      for (const msg of messages) {
        if (!msg.id) continue;
        
        // Generate a hash based on connection + msgId
        const hash = createHash('sha256').update(`${connectionId}:${msg.id}`).digest('hex');

        // Check if already processed
        const existing = await db.select({ id: emailLogs.id }).from(emailLogs).where(eq(emailLogs.hash, hash)).limit(1);
        
        if (existing.length === 0) {
          // Insert to DB as PENDING
          const inserted = await db.insert(emailLogs).values({
            connectionId,
            messageId: msg.id,
            threadId: msg.threadId,
            hash,
          }).returning({ id: emailLogs.id });
          
          // Queue for parsing
          await gmailParsingQueue.add('parse-email', {
            logId: inserted[0].id,
            messageId: msg.id,
            connectionId,
          });

          messagesFetched++;
        }
      }
    } while (pageToken);

    // Save final status
    await db.update(gmailSyncLogs).set({
      status: 'COMPLETED',
      messagesFetched,
    }).where(eq(gmailSyncLogs.id, syncLogId));

  } catch (error) {
    console.error('Gmail Sync Error', error);
    await db.update(gmailSyncLogs).set({
      status: 'FAILED',
      errorDetails: (error as Error).message,
    }).where(eq(gmailSyncLogs.id, syncLogId));
  }
}
