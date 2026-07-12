# PocketCA — Backend Folder Architecture & Module Organization

This document defines the strict folder architecture and module organization for the PocketCA backend. It enforces Clean Architecture, Feature-First organization, and SOLID principles.

## Architecture Philosophy
- Feature First Architecture
- Modular Architecture
- Clean Architecture
- SOLID Principles
- Repository Pattern
- Dependency Injection
- Single Responsibility Principle
- Open Closed Principle
- Scalable Module Design
- **Rule**: Never mix unrelated logic.

## High-Level Structure
```
backend/
├── src/
│   ├── config/       # Environment variables, database connection strings, third-party configs
│   ├── core/         # Core application setup, DI containers, app lifecycle
│   ├── common/       # Reusable cross-module logic (logger, error handler, pagination, formatters)
│   ├── modules/      # Feature modules (auth, users, transactions, goals, etc.)
│   ├── plugins/      # Fastify plugins (JWT, Helmet, CORS, Swagger, Rate Limiting)
│   ├── middlewares/  # Fastify middlewares (Auth, Logging, Rate Limiting)
│   ├── hooks/        # Fastify lifecycle hooks
│   ├── utils/        # Stateless utility functions (currency, date, crypto)
│   ├── constants/    # Global constants, enums, magic strings
│   ├── types/        # Global TypeScript interfaces and types
│   ├── database/     # Drizzle schema, migrations, seeders, client
│   ├── queues/       # Background job queues (BullMQ setup)
│   ├── jobs/         # Background job processors and workers
│   ├── events/       # Event-driven architecture (pub/sub, event emitters)
│   ├── storage/      # File upload logic, Supabase storage wrappers
│   └── ai/           # AI providers, prompts, context, memory (OpenAI, Gemini)
├── docs/             # Documentation, API specs, architectural decisions
├── tests/            # E2E tests, unit tests, integration tests
└── scripts/          # Automation scripts (DB migrations, seeders, dev tools)
```

## Feature Module Structure (`src/modules/[feature]/`)
Every feature (e.g., `auth`, `user`, `transactions`, `goals`) must remain isolated and follow this exact structure:
```
modules/feature_name/
├── feature_name.controller.ts  # Handles request/response, validation mapping
├── feature_name.service.ts     # Business logic, orchestration
├── feature_name.repository.ts  # Database access, Drizzle queries
├── feature_name.routes.ts      # Fastify route definitions
├── feature_name.schema.ts      # Validation schemas (Zod)
├── feature_name.dto.ts         # Data Transfer Objects
├── types.ts                    # Feature-specific types
├── interfaces.ts               # Dependency injection interfaces
└── feature_name.test.ts        # Unit and integration tests
```

## Layer Dependency Rules
Strict one-way dependency flow:
**Routes** ➔ **Controllers** ➔ **Services** ➔ **Repositories** ➔ **Database**

- **Routes**: Receive request, validate input (via schemas), call controller, return response.
- **Controllers**: Read req/query/body, call services, format response, handle HTTP status codes. No business logic.
- **Services**: Pure business logic. Coordinate repositories, external APIs (AI, queues, notifications). Framework-agnostic.
- **Repositories**: Pure database access (CRUD, transactions, pagination). No business logic.

## Event-Driven Communication
Modules should not be tightly coupled. Example: 
If a Goal is met, the `Goal Module` emits a `goal.completed` event. The `Notification Module` listens to this event and sends the push notification.

## Response Format
Every API must return a structured response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": { "pagination": {} },
  "timestamp": "2026-07-01T23:18:00Z",
  "requestId": "req-12345"
}
```

## Error Structure
Errors must use domain-specific classes (`BadRequest`, `Unauthorized`, `NotFound`, etc.) and return:
- Code
- Message
- Status
- Details
- Recovery Action

## Non-Negotiable Rules
- **Configuration**: Never hardcode values. Use `config/env.ts` with Zod validation.
- **Hooks/Routes**: Never place business logic inside Fastify hooks or route definitions.
- **Background Jobs**: Long-running tasks must be pushed to Queues (`BullMQ`). API requests must not block.
- **AI Layer**: AI logic (prompts, embeddings) belongs strictly in `src/ai/`, never mixed directly into normal services.
- **Naming**: Use descriptive names (`auth.controller.ts`).
- **Imports**: Prefer absolute imports, avoid circular dependencies.

This architecture ensures horizontal scalability and maintainability for a senior engineering team.
