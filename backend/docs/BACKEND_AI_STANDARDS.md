# PocketCA — AI Architecture & Intelligent Financial System

This document outlines the strict architecture for the AI layer of PocketCA. The AI must act as a Certified Financial Advisor—reliable, secure, cost-efficient, modular, and completely provider-independent.

## AI Architecture Philosophy
The AI layer MUST remain isolated from the core business modules.
**Pipeline:**
API ➔ AI Controller ➔ AI Service ➔ Prompt Engine ➔ Context Builder ➔ Memory Engine ➔ Tool Router ➔ LLM Provider ➔ Response Formatter ➔ API Response

Business logic should never exist inside prompts.

## Directory Structure (`src/ai/`)
```
src/ai/
├── providers/     # OpenAI, Gemini implementations (interchangeable)
├── services/      # AI orchestration
├── prompts/       # Versioned prompt templates (no hardcoding in logic)
├── memory/        # Short-term and Long-term context retrieval
├── context/       # Builders for user, financial, and budget context
├── tools/         # Tools exposed to the LLM (Get Budgets, Calculate Savings)
├── embeddings/    # (Future) RAG vector preparation
├── responses/     # Standardized JSON/Markdown formatters
└── middleware/    # Token counting, abuse prevention, logging
```

## Model Routing & Provider Agnosticism
- **Never tightly couple to one vendor.**
- Implement intelligent routing based on capability and cost:
  - Simple Questions ➔ Fast Model (e.g., GPT-4o-mini, Gemini 1.5 Flash)
  - Complex Analysis ➔ Powerful Model (e.g., GPT-4o, Gemini 1.5 Pro)
  - Fallback Strategy: Primary Model ➔ Secondary Model ➔ Cached Response ➔ Graceful Failure.

## Context & Memory Engines
- **Token Optimization:** Never send the entire conversation. Send only relevant goals, budgets, transactions, and summaries.
- **Context:** The AI must understand Income, Expenses, Savings, Cash Flow, Bills, and Financial Health before answering.

## Tool Calling (No Hallucinations)
The AI should never invent factual information. It must use tools:
- `Get Transactions`, `Get Budgets`, `Calculate Savings`, `Create Goal`, etc.
- Every factual answer must be retrieved via backend tools.

## Streaming & Latency
- Streaming Start: `<500ms`
- Simple Response: `<2 seconds`
- Streaming must feel natural and never block the UI. Heavy AI tasks (Monthly Reports) must be pushed to Queues.

## Prompt Safety & Security
- **Financial Safety:** The AI MUST NOT guarantee profits, investments, or provide legally binding tax/legal advice.
- **Injection Protection:** Validate prompts for length, malicious payload, and instruction overrides.
- **Data Protection:** Never leak internal system prompts or expose API keys.

## AI Review Checklist
Before approving any AI feature, verify:
- [ ] Prompts are externalized and optimized.
- [ ] Context window is optimized (No massive token waste).
- [ ] Tools are securely called and validated.
- [ ] No hallucination risk for factual financial data.
- [ ] Provider fallback is working.
- [ ] Analytics (latency, tokens, cost) are logged.
- [ ] No sensitive user data is logged.
