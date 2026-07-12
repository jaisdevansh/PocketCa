import { BaseEmailParser, EmailPayload } from './base.email.parser';
import { HDFCEmailParser } from './strategies/banks/hdfc.email.parser';
import { ParsedTransaction } from '../../sms/types/parser.types';

export class EmailParserFactory {
  private static parsers: BaseEmailParser[] = [
    new HDFCEmailParser(),
  ];

  static parse(email: EmailPayload): ParsedTransaction | null {
    for (const parser of this.parsers) {
      if (parser.canParse(email)) {
        const result = parser.parse(email);
        if (result) return result;
      }
    }
    return null;
  }
}
