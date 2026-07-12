# PocketCA — Database Architecture & Drizzle ORM Standards

This document establishes the strict rules for the PocketCA database architecture, leveraging PostgreSQL and Drizzle ORM.

## Database Philosophy
- **Normalized & Relational:** Use PostgreSQL.
- **ORM:** Drizzle ORM (type-safe, zero-dependency SQL builder).
- **Migration Tool:** Drizzle Kit.
- **Connection Pooling:** PgBouncer.
- **Caching:** Redis.
- **Rule:** Every table must have a single responsibility. Never duplicate data unless explicitly required for optimization.

## Table Standards
Every table MUST include:
- `id`: UUID (Primary Key). Never expose sequential IDs publicly.
- `createdAt`: Timestamp with time zone (stored in UTC).
- `updatedAt`: Timestamp with time zone (stored in UTC).
- `deletedAt`: For soft deletes (Users, Transactions, Goals, Bills, Notifications, Profiles).

## Core Schemas
- **Users:** `email` (unique), `phone` (unique), `passwordHash` (Argon2), `role`, `status`.
- **Profiles:** Name, Avatar, DOB, Income, Currency.
- **Transactions:** Amount, Type, Category, Date, Receipt, Tags. Requires DB Transactions.
- **Categories:** Income, Expense, Icon, Color. System categories are immutable.
- **Goals & Contributions:** Target, Current, Name, Status. Contributions map User -> Goal.
- **Budgets:** Monthly/Category Budgets, Spent Amount.
- **Bills:** Amount, Due Date, Recurring flag.
- **AI Conversations & Messages:** Immutable chat history and token usage tracking.
- **Audit Logs:** Tracks User, Action, Old Value, New Value, IP.
- **Payments:** Tracks Webhook Status, Gateway, Transaction ID.

## Database Transactions & ACID Compliance
**Always** use database transactions for:
- Payments
- Goal Contributions
- Budget Updates
- Bill Payments
- Subscription Updates
Never allow partial writes for financial operations.

## Drizzle ORM Rules
- Use strict schema definitions.
- Use explicit relations.
- Keep repositories clean; never write raw SQL unless absolutely necessary (and documented).
- **No N+1 Queries:** Use Drizzle's relational queries (`query.findMany({ with: {...} })`) to avoid N+1.
- Never use `SELECT *` in production. Only select required columns.

## Indexing & Performance
- Create indexes for `email`, `phone`, `userId`, `createdAt`, `transactionDate`, etc.
- Target query performance: `<10ms` for simple queries, `<20ms` for indexed queries.
- Do not create unnecessary indexes that slow down inserts.

## Security & Migrations
- **Passwords:** Argon2.
- **Secrets:** Never store unencrypted secrets.
- **Migrations:** Every schema change must be versioned via Drizzle Kit. Never modify production tables manually.
- **Seeding:** Maintain seed scripts for Dev/Testing. Never use production data for testing.

## Database Review Checklist
Before approving a schema PR, verify:
- [ ] Proper normalization and constraints.
- [ ] Foreign keys strictly enforce referential integrity.
- [ ] UUIDs used for Primary Keys.
- [ ] `createdAt`, `updatedAt` present on all tables.
- [ ] Soft deletes applied where necessary.
- [ ] Migrations created via Drizzle Kit.
- [ ] Repositories implemented with type-safe queries.
- [ ] No N+1 vulnerabilities.
