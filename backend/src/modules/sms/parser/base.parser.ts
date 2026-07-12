import { ParsedTransaction, SMSMessage } from '../types/parser.types';

export abstract class BaseSMSParser {
  abstract readonly bankName: string;
  abstract readonly version: string;

  /**
   * Determines if this parser can handle the given SMS based on the sender ID and/or body.
   */
  abstract canParse(sms: SMSMessage): boolean;

  /**
   * Performs the core extraction using regex strategies
   */
  abstract parse(sms: SMSMessage): ParsedTransaction;
  
  /**
   * Calculates a unified confidence score based on the extracted fields
   */
  protected calculateOverallConfidence(parsed: Partial<ParsedTransaction>): number {
    let score = 0;
    let fields = 0;
    
    const evaluate = (field: any) => {
      if (field && typeof field.confidence === 'number') {
        score += field.confidence;
        fields++;
      }
    };

    evaluate(parsed.amount);
    evaluate(parsed.merchant);
    evaluate(parsed.date);
    evaluate(parsed.transactionType);

    if (fields === 0) return 0;
    return Math.round(score / fields);
  }
}
