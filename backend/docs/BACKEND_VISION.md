# PocketCA — Backend Master Architecture & Engineering Philosophy

This document serves as the foundational constitution for the PocketCA backend. 
It defines the non-negotiable standards, architecture patterns, and the technology stack that must be adhered to across the entire backend lifecycle.

## Mission
PocketCA Backend exists to provide:
- Fast APIs
- Reliable APIs
- Secure APIs
- AI Services
- Financial Calculations
- Authentication
- Notifications
- Reporting
- Future Banking Integrations

Every API should feel enterprise-grade.

## Architecture Philosophy
The backend must follow:
- Feature First Architecture
- Modular Architecture
- Layered Architecture
- Clean Architecture Principles
- SOLID Principles
- Separation of Concerns
- Dependency Injection
- Scalable Modules
- No spaghetti code.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Caching**: Redis
- **Validation**: Zod
- **Authentication**: JWT
- **Password Hashing**: Argon2
- **Storage**: Supabase Storage
- **Payments**: Razorpay
- **AI**: OpenAI, Gemini
- **Queue**: BullMQ
- **Realtime**: WebSocket
- **Notifications**: Firebase Cloud Messaging
- **Monitoring**: Sentry
- **Analytics**: PostHog
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Backend Principles
- Every endpoint should be: fast, secure, typed, validated, documented, tested, monitored.
- Every module should be: independent, reusable, scalable, maintainable.

## Project Goals
Support: Authentication, Users, Transactions, Goals, Budgets, AI Coach, Reports, Notifications, Bills, Subscriptions, Admin, Future Bank Integrations.

## Non-Negotiable Rules
- Never trust client input.
- Never expose sensitive information.
- Never write business logic inside routes.
- Never write SQL directly inside controllers.
- Never duplicate logic.
- Never use `any`.
- Never skip validation, authentication, or authorization.
- Never ignore logging or monitoring.

## Final Objective
The PocketCA backend should be capable of handling enterprise-scale traffic while remaining clean, maintainable, secure, and easy for future engineers to extend. Every future backend implementation must follow this architecture without exception.
