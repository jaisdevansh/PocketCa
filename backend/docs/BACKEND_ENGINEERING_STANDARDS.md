# PocketCA — Engineering Standards & Production Excellence

This document establishes the strict coding, testing, logging, and operational standards required for the PocketCA backend. We do not write code just to make it work; we write code that engineers enjoy maintaining for years.

## Engineering Philosophy & Code Quality
- **Core Principles:** SOLID, DRY, KISS, YAGNI, Clean Architecture. Composition over inheritance.
- **Strict Typing:** TypeScript strict mode is mandatory. Avoid `any` at all costs. Prefer Generics, Enums, and Discriminated Unions.
- **File & Function Size Targets:**
  - Functions: `<40 lines`
  - Methods: `<50 lines`
  - Controllers: `<200 lines`
  - Services: `<300 lines`
- **Naming Conventions:** Use descriptive file names (`auth.service.ts`, not `helper.ts`).

## Error Handling & Logging
- **Domain Errors:** Never throw generic errors. Use the predefined `BaseError` subclasses (`BadRequestError`, `UnauthorizedError`, etc.).
- **Structured Logging:** Use `pino`. Every log must contain: Request ID, Module, Action, Duration, Status, Timestamp.
- **Audit Logs:** All critical actions (Login, Goal Created, Payment, Permission Change) must be explicitly audited and traceable.
- **Secrets:** Never log passwords, tokens, or financial data.

## Observability & Health
- **Metrics:** Measure API latency, DB connections, Redis latency, AI cost, and Queue length.
- **Health Checks:** Expose endpoints to verify DB, Redis, Queues, AI Providers, and Payment Gateways.

## Testing Strategy
- **Testing Pyramid:** Unit Tests ➔ Integration Tests ➔ API Tests ➔ E2E Tests ➔ Load Tests ➔ Security Tests.
- **Requirements:** Test Services, Repositories, Validators, and Financial Logic. Never deploy untested security rules.
- **Regression:** Ensure API backward compatibility.

## Git & Release Standards
- Feature branches and Pull Requests are mandatory.
- Semantic Commits (Conventional Commits) are required.
- **Production Checklist:** Code is not complete until Tests pass, Types are clean, Security is verified, Logs are present, and Performance benchmarks are met.

## The Golden Rule
Always leave the codebase better than you found it. Prefer explicit code over clever code.
