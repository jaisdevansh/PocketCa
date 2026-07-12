# PocketCA — Frontend Engineering Excellence

## Mission (Zero-Compromise Engineering)
Every screen must feel production-ready, every component reusable, every animation native-smooth (60 FPS), and every feature heavily optimized. **Never trade quality for speed.**

## Modern React & Architecture
- **State Flow:** React State (Component) -> Zustand (Global Client) -> TanStack Query (Server) -> MMKV (Local Cache) -> Secure Store (Secrets).
- **Forms:** React Hook Form + Zod.
- **Lists:** FlashList exclusively for heavy production screens.
- **Architecture:** Feature-first modular structure with strictly no circular dependencies or deeply nested folders.

## Performance & Optimization
- **React:** Use `React.memo`, `useMemo`, and `useCallback` only where measurable benefits exist. Lazy load and split code.
- **Network:** Support retries, timeouts, cancellation, offline caching, and graceful failure. NEVER make duplicate requests.
- **Animations:** Use `react-native-reanimated`. NEVER block the JS thread.

## The Ultimate QA Checklist
Before any feature is complete, it must pass this zero-tolerance check:
- ✓ No TypeScript errors or `any` usage.
- ✓ No ESLint or Runtime warnings.
- ✓ No Duplicate code, utilities, or components.
- ✓ No Memory Leaks or Infinite Re-renders.
- ✓ No Unnecessary API Calls.
- ✓ No Hardcoded Values (Always use Design Tokens).
- ✓ No Dead Code, console logs, or TODOs.
- ✓ Complete Error, Empty, Loading, and Offline states.
- ✓ Complete Accessibility support.
- ✓ 60 FPS lists and animations.

## Final Review Rule
Never stop at "working". Stop only at "excellent".
