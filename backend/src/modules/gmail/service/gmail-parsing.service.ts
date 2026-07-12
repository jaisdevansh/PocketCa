import { simpleParser } from 'mailparser';
import * as cheerio from 'cheerio';
import { google } from 'googleapis';
import { db } from '../../../database/connection/database';
import { emailLogs, emailParserLogs, emailFailures, emailConnections } from '../../../database/schema/parsers';
import { eq } from 'drizzle-orm';
import { GmailOAuth } from '../oauth/gmail.oauth';
import { EmailParserFactory } from '../parser/factory';
import { DuplicateDetector } from '../../sms/parser/duplicate/duplicate.detector';
import { MerchantNormalizer } from '../../sms/parser/merchant/merchant.normalizer';
import { transactions } from '../../../database/schema/transactions';
import { merchants } from '../../../database/schema/merchants';

export class EmailParsingService {
  async parseEmailJob(logId: string, messageId: string, connectionId: string) {
    const startTime = Date.now();

    try {
      const connectionRecords = await db.select().from(emailConnections).where(eq(emailConnections.id, connectionId)).limit(1);
      if (!connectionRecords.length) throw new Error('Connection not found');
      const connection = connectionRecords[0];

      if (!connection.refreshToken) {
        throw new Error('No refresh token available');
      }

      const auth = GmailOAuth.getAuthenticatedClient(connection.refreshToken);
      const gmail = google.gmail({ version: 'v1', auth });

      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'raw',
      });

      if (!msg.data.raw) throw new Error('No raw payload in email');

      // Decode base64url
      const emailBuffer = Buffer.from(msg.data.raw, 'base64url');
      const parsedMail = await simpleParser(emailBuffer);

      let rawText = parsedMail.text || '';
      let rawHtml = parsedMail.html || '';

      if (rawHtml) {
        // Use cheerio to extract clean text from HTML
        const $ = cheerio.load(rawHtml);
        const textFromHtml = $('body').text().replace(/\s+/g, ' ').trim();
        if (textFromHtml) {
          rawText = textFromHtml; // Fallback to HTML-derived text if better
        }
      }

      // 1. Detect Provider & Parse
      const sender = parsedMail.from?.value[0]?.address || '';
      const subject = parsedMail.subject || '';
      const date = parsedMail.date || new Date();
      
      const parsed = EmailParserFactory.parse({
        sender,
        subject,
        body: rawText,
        html: rawHtml,
        date,
      });

      if (!parsed) {
        await db.update(emailLogs).set({ processed: true }).where(eq(emailLogs.id, logId));
        return;
      }

      // Check Duplicates using existing SMS logic
      const isDuplicate = await DuplicateDetector.isDuplicateTransaction(connection.userId, parsed);
      if (isDuplicate) {
        await db.update(emailLogs).set({ processed: true }).where(eq(emailLogs.id, logId));
        return;
      }

      // Normalize Merchant
      const normalizedMerchant = await MerchantNormalizer.normalize(parsed.merchant.value);

      // Save Transaction
      await db.transaction(async (tx: any) => {
        let mId: string | null = null;
        if (normalizedMerchant.name) {
          const existingMerchant = await tx.select().from(merchants).where(eq(merchants.normalizedName, normalizedMerchant.name.toUpperCase())).limit(1);
          if (existingMerchant.length > 0) {
            mId = existingMerchant[0].id;
          } else {
            const newM = await tx.insert(merchants).values({
              displayName: normalizedMerchant.name,
              normalizedName: normalizedMerchant.name.toUpperCase(),
            }).returning({ id: merchants.id });
            mId = newM[0].id;
          }
        }

        await tx.insert(transactions).values({
          userId: connection.userId,
          amount: parsed.amount.value.toString(),
          currency: parsed.currency.value,
          type: parsed.transactionType.value,
          merchantId: mId,
          transactionDate: parsed.date.value,
          referenceNumber: parsed.referenceNumber?.value,
          accountLastFourDigits: parsed.accountLastFour?.value,
          status: 'COMPLETED',
          source: 'EMAIL',
          rawMetadata: {
            paymentMethod: parsed.paymentMethod?.value,
            notes: `Parsed by ${parsed.parserVersion} (Conf: ${parsed.overallConfidence}%)`
          },
        });

        await tx.update(emailLogs).set({ processed: true, confidence: parsed.overallConfidence.toString() }).where(eq(emailLogs.id, logId));
        await tx.insert(emailParserLogs).values({
          emailLogId: logId,
          rawHtmlLength: rawHtml.length,
          rawTextLength: rawText.length,
          executionTimeMs: Date.now() - startTime,
        });
      });

    } catch (error) {
      console.error('Email Parsing Error', error);
      await db.transaction(async (tx: any) => {
        await tx.update(emailLogs).set({ processed: true }).where(eq(emailLogs.id, logId));
        await tx.insert(emailFailures).values({
          emailLogId: logId,
          reason: (error as Error).message,
        });
      });
      throw error;
    }
  }
}

export const emailParsingService = new EmailParsingService();
