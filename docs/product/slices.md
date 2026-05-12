# TaskFlow Product Slices

This document defines the release slices that describe TaskFlow's product and platform evolution and continue to drive delivery from now on.

## Slice 1: Runtime And Application Foundation

- Status: `Shipped`
- Outcome: a runnable baseline for the web app, API, Redis-backed auth support, database-backed task storage, and the Celery worker
- Primary surfaces: `apps/web/src/app/page.tsx`, `apps/api/main.py`, `apps/worker/main.py`, `docker-compose.yml`

## Slice 2: Authentication And Session Foundation

- Status: `Shipped`
- Outcome: authenticated entry into TaskFlow through registration, login, session bootstrap, refresh-token rotation, and logout
- Primary surfaces: `apps/web/src/app/login/page.tsx`, `apps/web/src/app/signup/page.tsx`, `apps/web/src/lib/auth/context.tsx`, `apps/api/app/auth/routes.py`, `apps/api/app/graphql/schema.py`

## Slice 3: Task Management Baseline

- Status: `Shipped`
- Outcome: authenticated users can create, edit, delete, complete, and inspect their own tasks through the GraphQL-backed workspace
- Primary surfaces: `apps/web/src/app/tasks/page.tsx`, `apps/web/src/lib/hooks/useTasks.ts`, `apps/api/app/services/task_service.py`, `apps/api/app/graphql/schema.py`

## Slice 4: Task Workspace Experience Hardening

- Status: `Shipped`
- Outcome: the task workspace gains URL-synced filters, search, sorting, optimistic updates, and delete confirmation
- Primary surfaces: `apps/web/src/components/tasks/filters/TaskFilters.tsx`, `apps/web/src/components/tasks/form/TaskForm.tsx`, `apps/web/src/lib/hooks/useTaskActions.ts`

## Slice 5: Background Analytics Scaffold

- Status: `Partial`
- Outcome: the worker can schedule analytics aggregation work, but analytics computation is still scaffolding rather than a finished product surface
- Primary surfaces: `apps/worker/main.py`, `apps/worker/tasks/analytics.py`

## Slice 6: Monorepo Workflow Overhaul

- Status: `Shipped`
- Outcome: runtime setup, planning, grouped commits, signed verification, and validation use one canonical repo contract
- Primary surfaces: `AGENTS.md`, `.cursor/rules/*`, `docs/`, `Makefile`, `scripts/devops/*`, `.github/workflows/ci.yml`

## Slice 7: Product Docs Backfill And Status Normalization

- Status: `Shipped`
- Outcome: the product, checklist, slice, phase, and feature-spec docs reflect live repo truth and become the de-facto planning baseline from now on
- Primary surfaces: `docs/product/*`, `docs/planning/*`

## Slice 8: Contract Truth Hardening

- Status: `In Progress`
- Outcome: schema, dependency security, tests, worker depth, and package boundaries match the shipped product surface without known drift
- Primary surfaces: Alembic migrations, SQLAlchemy models, dependency manifests, `apps/web/e2e`, task UI tests, worker analytics, shared packages
