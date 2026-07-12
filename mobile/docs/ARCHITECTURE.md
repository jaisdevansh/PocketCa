# PocketCA — Frontend Architecture & Engineering Standards

## Architecture Philosophy
- Scalability, Readability, Maintainability, Performance, Developer Experience, Separation of Concerns, Type Safety, Feature Isolation, Reusability, Consistency.
- Code must be written for the *next* developer.

## Tech Stack
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Routing:** Expo Router
- **State Management:** Zustand (Global UI), TanStack Query (Server State)
- **Styling:** NativeWind (Note: Previously built with strict StyleSheet objects per Part 3 auto-approval. See open questions).
- **Forms:** React Hook Form
- **Validation:** Zod
- **Animations:** React Native Reanimated
- **Lists:** FlashList
- **Storage:** MMKV (Local), Expo Secure Store (Secure)
- **Charts:** React Native SVG
- **Notifications:** Firebase Cloud Messaging
- **Analytics/Crash:** Sentry, PostHog

## Folder Structure (Feature-First)
The app is divided into isolated features. Features never depend directly on each other.
```
src/
├── core/           # theme, constants, config
├── shared/         # global reusable components, hooks, utils
├── store/          # global Zustand stores (Auth, Theme)
├── providers/      # TanStack, Theme, Navigation providers
└── features/
    ├── auth/       # components, hooks, services, api, types, schemas for Auth
    ├── dashboard/
    ├── transactions/
    └── goals/
```

## Screen Architecture
- Screens should only compose UI, Navigation, and Custom Hooks. 
- **NO BUSINESS LOGIC OR DIRECT API CALLS IN SCREENS.**
- Use custom hooks (e.g., `useLogin()`) which internally call the API/Service Layer via TanStack Query.

## State Management Rules
- **Zustand:** ONLY for Auth, Theme, Preferences, Feature Flags, global UI state. NEVER for server data.
- **TanStack Query:** ALL server state. Manages caching, retries, invalidation, background refreshes.
- **MMKV:** Fast, synchronous local cache (drafts, UI state). No sensitive data.
- **Secure Store:** Tokens, credentials.

## Form Architecture
- Every form MUST use **React Hook Form** and **Zod Validation**.
- Must support loading, disabled, error states, and keyboard optimization.

## API & Service Layer
- Screen -> Custom Hook -> Service Layer -> API Layer -> Network.
- Every API request must support timeout, retry, offline, unauthorized, and validation errors.

## Performance & Testing
- Use `FlashList` for all large lists.
- Memoize expensive components, lazy load, optimize images, keep 60fps.
- Ensure testability (Business logic must be independently testable).
