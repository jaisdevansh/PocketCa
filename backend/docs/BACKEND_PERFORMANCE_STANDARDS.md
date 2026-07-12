# PocketCA — Performance Engineering & Production Infrastructure

This document outlines the strict scalability, caching, queueing, and performance architecture required for the PocketCA backend. Performance is a feature, and horizontal scalability is mandatory.

## Performance Targets
- **Health API:** `<20ms`
- **Cached API / Redis Lookup:** `<50ms` / `<5ms`
- **Authentication / Simple API:** `<100ms`
- **Normal CRUD:** `<150ms`
- **Dashboard Aggregation:** `<250ms`
- **AI Streaming Start:** `<500ms`

## Architecture & Scalability Principles
- **Stateless APIs:** The backend must be completely stateless to allow infinite horizontal scaling via containers/auto-scaling.
- **Connection Pooling:** Optimize PgBouncer and Redis connections to prevent exhaustion under heavy burst traffic.
- **Parallel Processing:** Never await independent tasks sequentially (e.g., when loading the Dashboard, fetch Profile, Goals, and Transactions concurrently via `Promise.all`).

## Caching Strategy (Redis)
- **Use Cases:** Dashboards, Insights, Reports, Settings, Feature Flags, Rate Limiting.
- **Keys:** Use structured keys (`user:{id}`, `dashboard:{id}`).
- **Invalidation:** Implement automatic invalidation on writes. Never cache stale financial data.

## Background Queues (BullMQ)
Heavy tasks must **never** block the API response lifecycle.
- **Queues:** `notification.queue`, `email.queue`, `ai.queue`, `report.queue`, `payment.queue`.
- **Job Requirements:** Every job must support idempotency, retries, exponential backoff, dead-letter queues (DLQ), and timeouts.
- **Schedulers (Cron):** Use schedulers for daily/monthly reports, bill reminders, and cache cleanups.

## Database Optimization
- Use specific column selections; never use `SELECT *`.
- Eliminate all N+1 queries.
- Support bulk inserts and batch operations for heavy writes (e.g., batch notifications).

## Fault Tolerance & Observability
- **Resilience:** Implement retries, fallbacks, and circuit breakers (especially for AI and Payment providers). Never allow a single external service failure to crash the backend.
- **Monitoring:** Track CPU, RAM, Queue sizes, DB latency, and AI cost.
- **Alerting:** Configure automatic alerts for error spikes, high latency, and payment/webhook failures.

## Performance Review Checklist
Before releasing any feature, verify:
- [ ] API is under the performance budget.
- [ ] Database queries are indexed and optimized.
- [ ] Heavy operations are moved to async Queues (`BullMQ`).
- [ ] Independent tasks are executed in parallel.
- [ ] Memory is stable (no leaks).
- [ ] Health checks and alerting are configured.
