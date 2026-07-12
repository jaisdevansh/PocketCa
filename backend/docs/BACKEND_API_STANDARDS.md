# PocketCA — API Architecture & Backend Engineering Rules

This document outlines the strict API design principles, REST standards, and engineering rules that all endpoints in the PocketCA backend must follow.

## API Versioning & REST Principles
- **Versioning:** All APIs must be versioned (e.g., `/api/v1/users`). Future versions must never break existing clients.
- **RESTful Methods:** 
  - `GET` - Read
  - `POST` - Create
  - `PUT` - Replace
  - `PATCH` - Partial Update
  - `DELETE` - Delete
- **Naming Conventions:** URLs must use **nouns**, never verbs (e.g., `/api/v1/users` instead of `/api/v1/getUsers`). Keep URLs clean, avoid deep nesting.

## Request & Response Standardization
### Request Validation
Every endpoint must validate Headers, Params, Query, Body, and Files using **Zod**. Never trust incoming requests.

### Standard Response Format
Every response must follow a strict, predictable JSON structure:
**Success:**
```json
{
  "success": true,
  "message": "Description of success",
  "data": {},
  "meta": { "pagination": {} },
  "timestamp": "ISO8601",
  "requestId": "uuid"
}
```
**Error:**
```json
{
  "success": false,
  "message": "Human readable error message",
  "error": "UNAUTHORIZED",
  "code": 401,
  "details": {},
  "timestamp": "ISO8601",
  "requestId": "uuid"
}
```

### Status Codes
- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `422` Validation Error
- `429` Rate Limited
- `500` Internal Server Error

## Core API Capabilities
- **Pagination:** Offset and Cursor pagination, returning rich metadata (`totalRecords`, `hasNext`).
- **Filtering & Searching:** Extensive support by date, category, amount, status, and semantic search (future).
- **Sorting:** Directional sorting on multiple fields (`createdAt`, `amount`, etc.).
- **Rate Limiting:** Granular rate limits for Auth, Public, AI, and Sensitive endpoints.
- **Idempotency:** Critical endpoints (Payments, Subscriptions) must guarantee idempotency to prevent duplicate operations.

## Security & Reliability
- **Transactions:** Financial operations must be wrapped in ACID database transactions.
- **Background Processing:** Heavy operations (Email, AI, Reports) must be pushed to Queues and processed asynchronously.
- **Caching:** Redis cache for fast-moving read-heavy data (Dashboards, Insights). Intelligent invalidation is required.
- **Logging & Monitoring:** Structured logging (execution time, queries). Never log sensitive financial or personal data. Target response time <150ms.

## API Review Checklist
Every completed endpoint must pass this checklist before PR:
- [ ] Route follows noun-based naming conventions.
- [ ] Zod Validation implemented.
- [ ] Authentication & Authorization complete.
- [ ] Repository used for DB access (No direct DB in controllers).
- [ ] Business logic isolated in Services.
- [ ] Response standardized.
- [ ] Error handling complete.
- [ ] Documentation (Swagger) updated.
- [ ] No security issues or N+1 query problems.
- [ ] Production ready.
