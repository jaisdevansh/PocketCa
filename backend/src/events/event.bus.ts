import EventEmitter from 'events';
import { db } from '../database/connection/database';
import { eventLogs } from '../database/schema/system';
import { logger } from '../utils/logger';

// Typed event payloads for better IntelliSense and safety
export interface PocketCAEvents {
  TransactionCreated: { transactionId: string; userId: string; amount: number; source: string };
  TransactionUpdated: { transactionId: string; userId: string; updates: any };
  MerchantCreated: { merchantId: string; name: string };
  MerchantUpdated: { merchantId: string; updates: any };
  BudgetExceeded: { budgetId: string; userId: string; amountSpent: number; limit: number };
  GoalCompleted: { goalId: string; userId: string };
  GoalUpdated: { goalId: string; userId: string; currentAmount: number };
  SubscriptionDetected: { subscriptionId: string; userId: string; merchantId: string };
  RecurringDetected: { recurringId: string; userId: string; merchantId: string };
  UserRegistered: { userId: string; email: string };
  UserLoggedIn: { userId: string; ipAddress: string };
  AICompleted: { requestId: string; userId: string; provider: string };
  NotificationCreated: { notificationId: string; userId: string; type: string };
}

class EventBus extends EventEmitter {
  constructor() {
    super();
    // Increase max listeners as we might have many subscribers (queues, logging, analytics)
    this.setMaxListeners(50);
  }

  /**
   * Strongly typed emit wrapper that also logs the event to the database.
   */
  public async publish<K extends keyof PocketCAEvents>(
    eventName: K,
    payload: PocketCAEvents[K],
    emittedBy = 'system'
  ): Promise<boolean> {
    try {
      // 1. Emit the event in-memory to any listeners
      const result = this.emit(eventName, payload);

      // 2. Persist the event asynchronously for audit and debugging
      // We don't await this to avoid blocking the main event flow
      db.insert(eventLogs).values({
        eventName,
        payload: payload as any,
        emittedBy,
        status: 'PROCESSED',
      }).catch(err => {
        logger.error(`Failed to persist event log for ${eventName}`, err);
      });

      return result;
    } catch (error) {
      logger.error(`Error publishing event ${eventName}`, error);
      return false;
    }
  }

  /**
   * Strongly typed subscribe wrapper
   */
  public subscribe<K extends keyof PocketCAEvents>(
    eventName: K,
    listener: (payload: PocketCAEvents[K]) => void | Promise<void>
  ): this {
    return this.on(eventName, listener);
  }
}

export const eventBus = new EventBus();
