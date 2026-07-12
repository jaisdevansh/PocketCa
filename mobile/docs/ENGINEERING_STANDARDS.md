# PocketCA — Performance, Optimization, Security & Code Quality Standards

## Mission
PocketCA must feel Instant, Smooth, Responsive, Reliable, Battery Efficient, Memory Efficient, Secure, Scalable, and Premium. Every interaction should feel native.

## Performance Goals
- **Cold Launch:** < 2 seconds
- **Warm Launch:** Instant
- **Navigation:** < 200ms perceived delay
- **Animation:** 60 FPS (Opacity, Transform, Scale, Translate only)
- **Lists:** Smooth scrolling with thousands of items (FlashList mandatory)

## Rendering & State Optimization
- Avoid unnecessary re-renders. Use `React.memo`, `useMemo`, `useCallback` *only* when measurable value is provided.
- Keep global state (Zustand) minimal. Local state stays local. Single source of truth.

## Network & Data Fetching (TanStack Query)
- Reduce unnecessary requests, batch when appropriate, prefetch predictable data.
- Support caching, retry, invalidation, offline cache, and optimistic updates.
- NEVER perform duplicate requests. NEVER manually recreate cache logic.

## Security & Privacy
- **Storage:** Secure Store for Access/Refresh tokens and Biometric credentials. MMKV for non-sensitive local cache only.
- **Validation:** Validate all user input via Zod. Never trust raw input or client-side validation alone.
- **Logs:** NEVER log passwords, tokens, sensitive financial data, or PII.

## Error Recovery & Offline Support
- **Errors:** Every failure must provide a clear explanation, retry button, fallback UI, and offline message.
- **Offline:** Users must be able to view cached dashboard, reports, and goals while offline. Clearly indicate offline status.

## Code Quality & Architecture
- Code must be readable, reusable, and predictable. Keep functions small and focused.
- **Review Checklist:** Before any screen is complete, it MUST have:
  - ✓ UI matches design system (No hardcoded values)
  - ✓ Loading state (Skeleton UI)
  - ✓ Empty state
  - ✓ Error state
  - ✓ Offline state
  - ✓ Accessibility passes
  - ✓ Performance optimized (No unnecessary re-renders)
  - ✓ No console logs or unused imports
