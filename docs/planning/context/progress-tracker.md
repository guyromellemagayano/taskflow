# TaskFlow Progress Tracker

This tracker was normalized against live repo surfaces on May 12, 2026. It records implementation truth, not a commit-by-commit narrative.

## Current Working Contract

- Canonical runtime: `bootstrap`, `doctor`, `up`, `dev`, `down`, `logs`, `urls`, `db-migrate`, `format-check`, `check-types`, `lint`, `test`, `build`, `validate`, `release-check`, `verify-commit`
- Canonical delivery flow: features -> checklist -> product slice -> phase -> feature spec -> active work -> bounded implementation -> validation -> grouped signed commit -> push
- Canonical repo governance: `AGENTS.md` plus `.cursor/rules/*`

## Current Product Posture

- Shipped baseline:
  - Public landing page reports API connectivity and operational endpoints.
  - Account creation, login, current-user bootstrap, refresh-token rotation, and logout exist across the current web and API surfaces.
  - Authenticated users can create, edit, delete, reschedule, reprioritize, and complete tasks from the web workspace.
  - Status, priority, search, and sort state are reflected in the `/tasks` URL.
  - The task workspace now exposes connection-backed pagination metadata, dedicated paging controls, and a focused single-task route at `/tasks/[id]`.
  - The task workspace now has behavioral component coverage plus a first browser smoke baseline under `apps/web/e2e`.
  - The API exposes GraphQL, REST auth, health, readiness, and metrics surfaces.
  - The worker now computes hourly task analytics snapshots from Postgres and persists the latest snapshot plus a rolling Redis history.
  - The dependency hardening baseline is now explicit: Python requirements audit cleanly, npm audit is clean, the Vite test toolchain is on the Vite 8 line, the web app runs on `next@16.2.6`, and the GraphQL codegen stack is on its patched line.
  - The Alembic history now upgrades task and user tables into the same snake_case database contract that SQLAlchemy metadata expects.
- Partial or constrained:
  - Browser auth is split between GraphQL token persistence in the web app and REST cookie-setting auth endpoints on the API.
  - The task detail route is intentionally read-only; create, edit, delete, and status transitions still live in the main workspace.
  - The current browser suite is intentionally minimal smoke coverage; it does not yet exercise authenticated task CRUD, pagination changes, or task-detail navigation.
- Hardening debt:
  - The API still emits follow-up runtime warnings around FastAPI lifespan migration and older Python dependency surfaces.

## Current Next-Work Queue

- Clean up package and contract truth beyond dependency alerts
- Clean up FastAPI lifespan and Python dependency deprecation warnings
- Expand authenticated browser coverage beyond the current smoke baseline
