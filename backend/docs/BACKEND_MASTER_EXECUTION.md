# PocketCA — Ultimate Backend Execution Blueprint

This document represents the absolute, non-negotiable engineering standards for the PocketCA backend. The backend must be built to the standards of top-tier engineering organizations (Stripe, Vercel, Shopify).

## Master Implementation Sequence
Every feature MUST be implemented in this exact order:
1. Database Schema
2. Migration
3. Repository (Drizzle ORM)
4. Service (Business Logic)
5. Validation (Zod)
6. Controller (HTTP Logic)
7. Routes
8. Authentication / Authorization
9. Queues / Events
10. Logging / Monitoring
11. Tests & Documentation
12. Optimization

## Golden Rules
- **Never bypass architecture:** `Controller ➔ Service ➔ Repository ➔ DB`.
- **Services:** Contain ONLY business logic. Never access HTTP Request/Reply objects here.
- **Validation:** Validate all inputs (Headers, Body, Query, Params) strictly before processing.
- **Error Handling:** Throw specific domain errors. Never crash the API.
- **Financial Calculations:** Must be deterministic, auditable, and decimal-safe. Never use floating point for money.
- **AI Rules:** Never hallucinate financial data. Always use backend tools. Always sanitize inputs/outputs.
- **Pre-Feature Review:** Always audit existing code, fix broken foundations, and ensure dependencies are secure before writing new features.
- **No Technical Debt:** Dead code, magic numbers, huge files, and `any` types are strictly forbidden.

We do not build APIs just to make them work. We build a secure, observable, maintainable, and highly scalable financial engine.
