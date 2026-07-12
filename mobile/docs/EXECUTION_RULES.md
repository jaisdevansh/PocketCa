# PocketCA — Engineering Execution Rules & Non-Negotiable Standards

## Primary Objective
Build PocketCA as a professional, premium, reliable, scalable, and fast product capable of supporting millions of users. 
**Rule:** No shortcuts, no demo code, no prototypes, no hacks. Everything is production-ready.

## Strict Implementation Workflow
1. Understand Business Problem -> 2. Understand User Problem -> 3. Design UX -> 4. Build Reusable Components -> 5. Connect State -> 6. API Integration -> 7. Handle Loading -> 8. Handle Empty States -> 9. Handle Errors -> 10. Handle Offline -> 11. Optimize Performance -> 12. Test Accessibility -> 13. Production Review.

## Component & Screen Rules
- **Screens MUST include:** Purpose, Layout, Reusable Components, Business Logic, Loading (Skeleton), Empty State, Offline State, Error State, Accessibility, Animations, Performance Optimization.
- **Components:** Reuse existing ones before building new ones. Never create duplicate UI.

## Code Quality & Anti-Patterns (Things You Must Never Do)
- NEVER hardcode colors, spacing, or API responses.
- NEVER use inline styles unless absolutely necessary.
- NEVER mix business logic with UI (Strict UI -> Hook -> Service -> API flow).
- NEVER use "any" in TypeScript if a safe alternative exists.
- NEVER leave `console.log` or `TODO` comments in production.
- NEVER ignore accessibility or sacrifice performance for visual effects.

## AI Feature Rules (The Flagship Feature)
- The AI Coach must understand context, provide actionable advice, explain concepts simply, and encourage healthy habits.
- NEVER produce robotic responses or generate fake financial advice. Always explain reasoning.
