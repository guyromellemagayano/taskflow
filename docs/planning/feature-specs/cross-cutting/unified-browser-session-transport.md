# Delivery: Unified Browser Session Transport

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

Browser auth is split across two transport assumptions: GraphQL login and
registration store tokens in `localStorage`, while REST auth endpoints set
httpOnly cookies. That leaves the web app with two session paths and makes the
cookie-backed API contract harder to trust.

## Operator Outcome

The browser should use httpOnly cookies as the primary session transport for
GraphQL and REST auth surfaces, while existing bearer-token clients continue to
work as a fallback.

## Scope

- let GraphQL requests authenticate from auth cookies as well as bearer headers
- set and clear auth cookies from GraphQL login, registration, refresh, and
  logout
- move shared cookie behavior into one API helper used by REST and GraphQL
- make the web auth provider bootstrap from `me` instead of requiring readable
  browser tokens
- update authenticated browser coverage to model cookie-backed sessions
- update planning status docs after validation

## Non-Goals

- removing token fields from GraphQL auth payloads
- removing bearer-token support for non-browser clients
- redesigning refresh-token rotation
- adding new user-facing auth screens

## Boundaries

- `apps/api/app/auth/*`
- `apps/api/app/graphql/*`
- `apps/web/src/lib/auth/*`
- `apps/web/src/lib/graphql/client.ts`
- `apps/web/e2e/*`
- GraphQL schema snapshot and planning docs touched by this slice

## Acceptance Checks

- GraphQL auth can read the access token from browser cookies
- GraphQL auth mutations set or clear the same cookies as REST auth endpoints
- web auth bootstrap no longer depends on a readable access token
- authenticated Playwright coverage runs through cookie-backed browser state
- `pnpm --filter @taskflow/web test:e2e`
- `pnpm --filter @taskflow/web test:run`
- `pnpm --filter @taskflow/web type-check`
- targeted Python syntax or lint validation for changed API files

## Validation Plan

- centralize auth cookie helpers first
- update GraphQL context and auth mutations to use those helpers
- update the web auth provider to treat `me` as the session source of truth
- rerun browser coverage and focused web validation
- run targeted Python validation for changed API modules

## Validation Outcome

- `pnpm --filter @taskflow/web test:e2e`
- `pnpm --filter @taskflow/web test:run`
- `pnpm --filter @taskflow/web type-check`
- `python3 -m py_compile apps/api/app/auth/cookies.py apps/api/app/auth/routes.py apps/api/app/graphql/context.py apps/api/app/graphql/schema.py apps/api/app/schemas/auth.py`
- `docker compose run --rm api ruff check app/auth/cookies.py app/auth/routes.py app/graphql/context.py app/graphql/schema.py app/schemas/auth.py`
- `docker compose run --rm api sh -lc 'python -m compileall app main.py && python -c "import main"'`
- `docker compose config -q`
