# PocketCA — Security & Backend Protection Standards

This document establishes the zero-trust security model for the PocketCA backend. Security is the foundation of the platform, not an afterthought.

## Security Philosophy
- Zero Trust Architecture
- Defense in Depth
- Least Privilege Principle
- Secure by Default
- Privacy by Design
- Fail Securely

## Authentication & Authorization
- **JWT & Sessions:** Use short-lived Access Tokens and secure Refresh Tokens. Support session revocation and single/multi-device logout.
- **Passwords:** Never store plaintext. Hash with Argon2 using unique salts.
- **Role-Based Access Control (RBAC):** Roles include Guest, User, Premium User, Admin.
- **Permission Flow:** Authentication ➔ Authorization ➔ Ownership ➔ Business Rules ➔ Validation ➔ Execution.
  
## Input Validation & Sanitization
- Validate **EVERYTHING** (Headers, Body, Query, Params, Files) using Zod.
- Never process unvalidated input.
- Sanitize responses. Never leak internal IDs, DB stack traces, SQL queries, or API keys.

## API & Network Security
- **Rate Limiting:** Granular limits for Auth (brute force protection), AI, Public, and Payment endpoints.
- **CORS & Helmet:** Only trusted origins allowed. Strict CSP, HSTS, and frame protection via `@fastify/helmet`.
- **Encryption:** AES-256 for sensitive config. TLS 1.3 / HTTPS for all transit.

## AI & Data Security
- Validate and sanitize all AI prompts and outputs to prevent injection attacks.
- Do not expose model configurations or system prompts.
- **File Uploads:** Strict MIME type, size, and extension validation. Remove metadata before storage.

## Idempotency & Payments
- Financial endpoints (Payments, Subscriptions) must support idempotency keys to prevent duplicate processing.
- Webhooks must be verified using signature validation.
- Never trust client-side payment status.

## Audit Logging & Observability
- **Audit Logs:** Track User, Action, Module, Old/New Value, IP, Timestamp.
- **Security Monitoring:** Alert on failed logins, brute force, AI abuse, payment failures.
- **Never Log:** Passwords, Tokens, Private Financial Data, Secrets.

## Security Review Checklist
Before PR approval, ensure:
- [ ] Authentication & Authorization implemented.
- [ ] Ownership verified (users cannot access other users' data).
- [ ] Validation complete (Zod).
- [ ] Rate limiting enabled.
- [ ] SQL Injection prevented (Drizzle ORM).
- [ ] Secrets secured (Never hardcoded).
- [ ] Audit logs captured for sensitive actions.
