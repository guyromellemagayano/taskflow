# TaskFlow Progress Tracker

This tracker was normalized against live repo surfaces on May 12, 2026. It records implementation truth, not a commit-by-commit narrative.

## Current Working Contract

- Canonical runtime: `bootstrap`, `doctor`, `up`, `dev`, `down`, `logs`, `urls`, `db-migrate`, `format-check`, `check-types`, `lint`, `test`, `build`, `validate`, `release-check`, `verify-commit`
- Canonical delivery flow: features -> checklist -> product slice -> phase -> feature spec -> active work -> bounded implementation -> validation -> grouped signed commit -> push
- Canonical repo governance: `AGENTS.md` plus `.cursor/rules/*`
- Canonical Codex delegation: repo-scoped custom agents live under `.codex/agents` and are used only when the user explicitly asks for subagents, parallel delegation, or a named custom agent

## Current Product Posture

- Shipped baseline:
  - Public landing page reports API connectivity and operational endpoints.
  - Account creation, login, current-user bootstrap, refresh-token rotation, and logout exist across the current web and API surfaces.
  - Browser auth now uses same-origin `/graphql` and `/api` cookie transport as the primary path, with bearer-token support retained for legacy and non-browser clients.
  - Authenticated users can create, edit, delete, reschedule, reprioritize, and complete tasks from the web workspace.
  - Status, priority, search, and sort state are reflected in the `/tasks` URL.
  - The task workspace now exposes connection-backed pagination metadata, dedicated paging controls, and a focused single-task route at `/tasks/[id]`.
  - The task workspace now has behavioral component coverage plus authenticated browser coverage for task CRUD, pagination transitions, and detail navigation under `apps/web/e2e`.
  - The API exposes GraphQL, REST auth, health, readiness, and metrics surfaces.
  - The API lifecycle and password hashing runtime contract now runs through FastAPI lifespan and direct Argon2 helpers without the previous deprecation warning path.
  - The worker now computes hourly task analytics snapshots from Postgres and persists the latest snapshot plus a rolling Redis history.
  - `@taskflow/shared` now matches live auth/task contract fields, and web auth/task type helpers consume shared package definitions instead of stale local duplicates.
  - The dependency hardening baseline is now explicit: Python requirements audit cleanly, npm audit is clean, the Vite test toolchain is on the Vite 8 line, the web app runs on `next@16.2.6`, and the GraphQL codegen stack is on its patched line.
  - The Alembic history now upgrades task and user tables into the same snake_case database contract that SQLAlchemy metadata expects.
  - TaskFlow now has repo-scoped Codex custom-agent configuration for bounded planning, implementation, quality, security, runtime, and release delegation.
- Partial or constrained:
  - The task detail route is intentionally read-only; create, edit, delete, and status transitions still live in the main workspace.
- Hardening debt:
  - Broader package-boundary cleanup is still pending for non-shared workspace packages.

## Current Next-Work Queue

- Continue package-boundary cleanup beyond shared contract alignment
