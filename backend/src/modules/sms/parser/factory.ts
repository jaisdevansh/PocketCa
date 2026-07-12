import { BaseSMSParser } from './base.parser';
import { SMSMessage, ParsedTransaction } from '../types/parser.types';
import { HDFCSMSParser } from './strategies/banks/hdfc.parser';
// import { SBISMSParser } from './strategies/banks/sbi.parser'; // Example for future

export class ParserFactory {
  private static parsers: BaseSMSParser[] = [
    new HDFCSMSParser(),
    // new SBISMSParser(),
  ];

  /**
   * Identifies the correct parser for the SMS, executes it, and returns the extracted payload.
   */
  static parse(sms: SMSMessage): ParsedTransaction | null {
    const parser = this.parsers.find(p => p.canParse(sms));
    
    if (!parser) {
      return null;
    }

    try {
      return parser.parse(sms);
    } catch (err) {
      // Return a rejected format if the regex fails entirely
      return {
        isSpam: false,
        rejectReason: 'PARSING_ERROR: ' + (err as Error).message,
        overallConfidence: 0,
        parserVersion: parser.version,
        bankName: { value: parser.bankName, confidence: 100 },
        amount: { value: 0, confidence: 0 },
        currency: { value: 'INR', confidence: 0 },
        transactionType: { value: 'DEBIT', confidence: 0 },
        merchant: { value: 'UNKNOWN', confidence: 0 },
        date: { value: sms.receivedAt, confidence: 50 },
      };
    }
  }
}
