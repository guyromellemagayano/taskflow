# Frontend Architecture

## Primary Surface

- `apps/web` is the primary frontend application.

## Shared Package Rules

- `packages/shared` is for cross-workspace TypeScript utilities or types that are truly reusable.
- `packages/ui` must hold real shared UI contracts, not placeholder abstractions.
- `packages/graphql` should own GraphQL generation or contract sharing only if it is the authoritative place for that behavior.

## Import Rules

- Use workspace packages for reusable contracts.
- Use the local `@web/*` alias only inside `apps/web`.
- Do not recreate workspace imports with TypeScript-only aliases.

## Validation Rules

- Component and hook behavior should be covered by Vitest.
- Playwright belongs under `apps/web/e2e` when a real browser suite exists.
