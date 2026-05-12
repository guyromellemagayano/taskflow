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
  - The API exposes GraphQL, REST auth, health, readiness, and metrics surfaces.
- Partial or constrained:
  - Browser auth is split between GraphQL token persistence in the web app and REST cookie-setting auth endpoints on the API.
  - The task hooks and service layer support limit and offset, but the current GraphQL query returns a plain list and the web UI has no dedicated pagination controls.
  - The worker beat schedule exists, but analytics aggregation is still a placeholder task.
  - Task UI component test files exist, but they are placeholder `todo` suites rather than behavioral coverage.
- Hardening debt:
  - The initial Alembic migration still uses camelCase database columns while the current SQLAlchemy models map snake_case column names.
  - `apps/web/e2e` does not exist yet, so end-to-end browser validation is not part of the shipped repo baseline.
  - The API still emits follow-up runtime warnings around FastAPI lifespan migration and older Python dependency surfaces.

## Current Next-Work Queue

- Align Alembic migrations and SQLAlchemy models
- Replace placeholder task UI tests and add a real `apps/web/e2e` suite
- Make task pagination and task-detail surfaces truthful across web and GraphQL
- Implement real analytics aggregation instead of the current worker scaffold
- Continue package and Python runtime hardening under the normalized workflow contract
