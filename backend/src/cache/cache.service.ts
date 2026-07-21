import Redis from 'ioredis';
import { redisConfig } from '../config/redis.config';
import { db } from '../database/connection/database';
import { cacheMetadata } from '../database/schema/system';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger';

// Standard TTLs based on PocketCA rules (in seconds)
export const CACHE_TTL = {
  DASHBOARD: 15 * 60,       // 15 Minutes
  MERCHANT: 24 * 60 * 60,   // 24 Hours
  CATEGORIES: 7 * 24 * 60 * 60, // 7 Days
  BANKS: 30 * 24 * 60 * 60, // 30 Days
  SETTINGS: 30 * 60,        // 30 Minutes
  AI_INSIGHTS: 12 * 60 * 60,// 12 Hours
  REPORTS: 1 * 60 * 60,     // 1 Hour
  BUDGETS: 5 * 60,          // 5 Minutes
  GOALS: 5 * 60,            // 5 Minutes
  ANALYTICS: 30 * 60,       // 30 Minutes
};

class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(redisConfig.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  /**
   * Set a cache value with a specified TTL
   */
  async set(key: string, value: any, ttlSeconds: number, tags: string[] = []): Promise<void> {
    try {
      // Mocked to bypass Redis rate limits
      return;
    } catch (error) {
      logger.error(`Cache set error for key ${key}`, error);
    }
  }

  /**
   * Get a cached value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Mocked to bypass Redis rate limits
      return null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}`, error);
      return null;
    }
  }

  /**
   * Delete a specific cache key
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      await db.delete(cacheMetadata).where(eq(cacheMetadata.cacheKey, key));
    } catch (error) {
      logger.error(`Cache del error for key ${key}`, error);
    }
  }

  /**
   * Invalidate by a specific tag (e.g., 'user_123_dashboard')
   * This is a simplified approach. In a high-throughput env, we'd use Redis Sets for tags.
   */
  async invalidateByTag(tag: string): Promise<void> {
    try {
      // Find all keys in DB with this tag
      const records = await db.select().from(cacheMetadata);
      const keysToDelete = records
        .filter(r => (r.tags as string[])?.includes(tag))
        .map(r => r.cacheKey);

      if (keysToDelete.length > 0) {
        await this.redis.del(...keysToDelete);
        for (const key of keysToDelete) {
          await db.delete(cacheMetadata).where(eq(cacheMetadata.cacheKey, key));
        }
      }
    } catch (error) {
      logger.error(`Cache invalidateByTag error for tag ${tag}`, error);
    }
  }

  /**
   * Triggered when user updates their profile or transactions happen
   */
  async invalidateUserFinancials(userId: string): Promise<void> {
    // Invalidate cascades: Dashboard -> Budget -> Goal -> Analytics -> Reports -> AI
    const tags = [
      `user:${userId}:dashboard`,
      `user:${userId}:budgets`,
      `user:${userId}:goals`,
      `user:${userId}:analytics`,
      `user:${userId}:reports`,
      `user:${userId}:ai_insights`,
    ];

    for (const tag of tags) {
      await this.invalidateByTag(tag);
    }
  }
}

export const cacheService = new CacheService();
