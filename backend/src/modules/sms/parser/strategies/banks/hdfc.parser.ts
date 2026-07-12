import { BaseSMSParser } from '../../base.parser';
import { SMSMessage, ParsedTransaction } from '../../../types/parser.types';

export class HDFCSMSParser extends BaseSMSParser {
  readonly bankName = 'HDFC';
  readonly version = '1.0.0';

  private readonly senderRegex = /HDFCBK/i;

  // Real fintech uses complex versioned regex matrices, this is a basic abstraction structure
  private readonly regexes = {
    debit: /Rs\.?\s?([\d,]+(?:\.\d{1,2})?)\s*(?:has been debited|was withdrawn).*?from a\/c\s*(?:no\.\s*)?[\dX]+(\d{4}).*?(?:to|at)\s+([A-Za-z0-9\s]+?)\s*on\s*([\d-]+)/i,
    credit: /Rs\.?\s?([\d,]+(?:\.\d{1,2})?)\s*(?:has been credited).*?to a\/c\s*(?:no\.\s*)?[\dX]+(\d{4}).*?from\s+([A-Za-z0-9\s]+?)\s*on\s*([\d-]+)/i,
    upi: /UPI-(?:DR|CR).*?Rs\.?\s?([\d,]+(?:\.\d{1,2})?).*?to\s+([A-Za-z0-9\@\.\s]+)\s*Ref\.\s*(\d{12})/i,
    spamCheck: /(OTP|Offer|Discount|Loan|Credit Card)/i
  };

  canParse(sms: SMSMessage): boolean {
    return this.senderRegex.test(sms.sender);
  }

  parse(sms: SMSMessage): ParsedTransaction {
    if (this.regexes.spamCheck.test(sms.body)) {
      return this.rejectAsSpam();
    }

    // Try UPI
    const upiMatch = this.regexes.upi.exec(sms.body);
    if (upiMatch) {
      return this.buildTransaction(
        sms,
        Number(upiMatch[1].replace(/,/g, '')),
        'DEBIT', // Usually DR in UPI
        upiMatch[2].trim(),
        'UPI',
        95,
        { referenceNumber: upiMatch[3] }
      );
    }

    // Try Debit
    const debitMatch = this.regexes.debit.exec(sms.body);
    if (debitMatch) {
      return this.buildTransaction(
        sms,
        Number(debitMatch[1].replace(/,/g, '')),
        'DEBIT',
        debitMatch[3].trim(),
        'CARD',
        90,
        { accountLastFour: debitMatch[2] }
      );
    }

    // Try Credit
    const creditMatch = this.regexes.credit.exec(sms.body);
    if (creditMatch) {
      return this.buildTransaction(
        sms,
        Number(creditMatch[1].replace(/,/g, '')),
        'CREDIT',
        creditMatch[3].trim(),
        'NEFT/IMPS',
        90,
        { accountLastFour: creditMatch[2] }
      );
    }

    throw new Error('Regex matrix failed to match');
  }

  private buildTransaction(
    sms: SMSMessage,
    amount: number,
    type: 'CREDIT' | 'DEBIT',
    merchant: string,
    method: string,
    baseConfidence: number,
    extras: any = {}
  ): ParsedTransaction {
    const parsed: Partial<ParsedTransaction> = {
      amount: { value: amount, confidence: baseConfidence },
      currency: { value: 'INR', confidence: 100 },
      transactionType: { value: type, confidence: baseConfidence },
      merchant: { value: merchant, confidence: baseConfidence - 10 },
      date: { value: sms.receivedAt, confidence: 100 },
      bankName: { value: this.bankName, confidence: 100 },
      paymentMethod: { value: method, confidence: baseConfidence },
      isSpam: false,
      parserVersion: this.version,
    };

    if (extras.accountLastFour) {
      parsed.accountLastFour = { value: extras.accountLastFour, confidence: 100 };
    }
    
    if (extras.referenceNumber) {
      parsed.referenceNumber = { value: extras.referenceNumber, confidence: 100 };
    }

    parsed.overallConfidence = this.calculateOverallConfidence(parsed);
    
    return parsed as ParsedTransaction;
  }

  private rejectAsSpam(): ParsedTransaction {
    return {
      isSpam: true,
      rejectReason: 'Spam keywords detected',
      overallConfidence: 0,
      parserVersion: this.version,
      bankName: { value: this.bankName, confidence: 100 },
      amount: { value: 0, confidence: 0 },
      currency: { value: 'INR', confidence: 0 },
      transactionType: { value: 'DEBIT', confidence: 0 },
      merchant: { value: 'UNKNOWN', confidence: 0 },
      date: { value: new Date(), confidence: 0 },
    };
  }
}
