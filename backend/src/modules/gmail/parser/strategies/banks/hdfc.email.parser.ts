import { BaseEmailParser, EmailPayload } from '../../base.email.parser';
import { ParsedTransaction } from '../../../../sms/types/parser.types';

export class HDFCEmailParser extends BaseEmailParser {
  get providerName() { return 'HDFC Bank'; }
  get version() { return '1.0.0'; }

  canParse(email: EmailPayload): boolean {
    return email.sender.toLowerCase().includes('hdfcbank.net') || email.subject.toLowerCase().includes('hdfc bank');
  }

  parse(email: EmailPayload): ParsedTransaction | null {
    // This is a naive regex parser for HDFC plain text emails
    // A production version would use an extractor on email.html to parse tables
    const body = email.body.replace(/\s+/g, ' ');

    const amountMatch = body.match(/(?:Rs\.?|INR)\s*([\d,]+\.?\d*)/i);
    const merchantMatch = body.match(/at\s+([A-Z0-9\s]+?)\s+on/i);
    const dateMatch = body.match(/on\s+(\d{2}-\d{2}-\d{4})/i) || body.match(/on\s+(\d{2}-[a-zA-Z]{3}-\d{4})/i);

    if (amountMatch) {
      const isDebit = body.toLowerCase().includes('debited') || body.toLowerCase().includes('spent');
      
      const parsedDate = dateMatch ? new Date(dateMatch[1]) : email.date;

      return {
        bankName: { value: 'HDFC', confidence: 100 },
        amount: { value: parseFloat(amountMatch[1].replace(/,/g, '')), confidence: 100 },
        currency: { value: 'INR', confidence: 100 },
        transactionType: { value: isDebit ? 'DEBIT' : 'CREDIT', confidence: 100 },
        merchant: { value: merchantMatch ? merchantMatch[1].trim() : 'Unknown HDFC Merchant', confidence: merchantMatch ? 90 : 50 },
        date: { value: parsedDate, confidence: 90 },
        isSpam: false,
        overallConfidence: 85,
        parserVersion: this.version,
      };
    }
    
    return null; // Could not parse
  }
}
