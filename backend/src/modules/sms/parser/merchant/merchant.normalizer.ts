import { db } from '../../../../database/connection/database';
import { merchantAliases, merchants } from '../../../../database/schema/merchants';
import { eq } from 'drizzle-orm';

export class MerchantNormalizer {
  /**
   * Attempts to normalize a raw merchant string into a known, clean merchant name.
   * e.g., "AMAZON SELLER SERVICES" -> "Amazon"
   */
  static async normalize(rawMerchant: string): Promise<{ name: string; isResolved: boolean }> {
    const cleanRaw = rawMerchant.trim().toUpperCase();

    // 1. Check exact match in aliases
    const aliases = await db.select().from(merchantAliases).where(eq(merchantAliases.originalName, cleanRaw));
    
    if (aliases.length > 0) {
      // Find the canonical merchant name
      const merchant = await db.select().from(merchants).where(eq(merchants.id, aliases[0].merchantId));
      if (merchant.length > 0) {
        return { name: merchant[0].displayName, isResolved: true };
      }
    }

    // 2. Simple Pattern Matching heuristics (In real-world, we'd use fuzzy text matching / AI here)
    if (cleanRaw.includes('SWIGGY')) return { name: 'Swiggy', isResolved: true };
    if (cleanRaw.includes('ZOMATO')) return { name: 'Zomato', isResolved: true };
    if (cleanRaw.includes('AMAZON')) return { name: 'Amazon', isResolved: true };
    if (cleanRaw.includes('UBER')) return { name: 'Uber', isResolved: true };
    if (cleanRaw.includes('OLA')) return { name: 'Ola', isResolved: true };
    if (cleanRaw.includes('STARBUCKS')) return { name: 'Starbucks', isResolved: true };

    // 3. Fallback to raw string, capitalized
    const fallback = rawMerchant
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { name: fallback, isResolved: false };
  }
}
