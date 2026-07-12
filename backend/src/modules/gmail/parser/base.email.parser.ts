import { ParsedTransaction } from '../../sms/types/parser.types';

export interface EmailPayload {
  sender: string;
  subject: string;
  body: string;
  html: string;
  date: Date;
}

export abstract class BaseEmailParser {
  abstract get providerName(): string;
  abstract get version(): string;
  
  abstract canParse(email: EmailPayload): boolean;
  abstract parse(email: EmailPayload): ParsedTransaction | null;
}
