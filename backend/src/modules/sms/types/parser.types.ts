export interface ExtractedField<T> {
  value: T;
  confidence: number;
}

export interface ParsedTransaction {
  amount: ExtractedField<number>;
  currency: ExtractedField<string>;
  transactionType: ExtractedField<'CREDIT' | 'DEBIT'>;
  bankName: ExtractedField<string>;
  accountLastFour?: ExtractedField<string>;
  referenceNumber?: ExtractedField<string>;
  utr?: ExtractedField<string>;
  upiId?: ExtractedField<string>;
  balance?: ExtractedField<number>;
  date: ExtractedField<Date>;
  paymentMethod?: ExtractedField<string>; // UPI, NEFT, CARD, CASH
  merchant: ExtractedField<string>; // Raw extracted merchant name
  
  overallConfidence: number;
  parserVersion: string;
  isSpam: boolean;
  rejectReason?: string;
}

export interface SMSMessage {
  id: string; // Original ID from mobile app
  sender: string;
  body: string;
  receivedAt: Date;
  hash?: string;
}
