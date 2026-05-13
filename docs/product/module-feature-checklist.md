# TaskFlow Module Feature Checklist

Use this file to record whether a module capability is shipped, partial, planned, or needs hardening.

## Status Meanings

- `shipped`: part of the current canonical product or repo contract
- `partial`: present but constrained, placeholder-backed, or missing follow-through
- `planned`: intentionally not shipped yet
- `needs-hardening`: shipped-adjacent contract drift or quality debt that should be corrected

## Current Module Status

| Module                 | Capability                                                        | Status    | Notes                                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App shell              | Public landing page with API connectivity status                  | `shipped` | `/` reports API availability and links to operational endpoints instead of acting as a full dashboard.                                                        |
| Auth and sessions      | Email-and-password sign-up                                        | `shipped` | Backed by the GraphQL `register` mutation and the `/signup` page.                                                                                             |
| Auth and sessions      | Login, refresh, current-user bootstrap, and logout                | `shipped` | The web app uses GraphQL auth flows and the API also exposes REST login, refresh, and logout endpoints.                                                       |
| Auth and sessions      | Unified browser session transport                                 | `shipped` | Browser auth now uses same-origin `/graphql` and `/api` cookie transport as the primary path, while bearer tokens remain available for fallback clients.      |
| Task workspace         | Create, edit, delete, and status-change task flows                | `shipped` | The `/tasks` workspace supports task CRUD and inline state changes.                                                                                           |
| Task workspace         | Search, filter, sort, and URL-synced list state                   | `shipped` | Status, priority, search, sort field, and sort order are reflected in the URL.                                                                                |
| Task workspace         | Pagination metadata and dedicated pagination controls             | `shipped` | The GraphQL task list now returns connection metadata, and the `/tasks` workspace drives page state from the URL with explicit paging controls.               |
| Task workspace         | Single-task detail experience                                     | `partial` | A dedicated `/tasks/[id]` route now exposes read-only task detail, but editing and status transitions remain intentionally centered in the main workspace.    |
| API and operations     | Root, API info, health, readiness, and metrics endpoints          | `shipped` | The API exposes operational endpoints alongside GraphQL and auth routes.                                                                                      |
| API and operations     | GraphQL task and auth surfaces                                    | `shipped` | Queries and mutations exist for tasks, current user, registration, login, refresh, and logout.                                                                |
| API and operations     | Runtime lifecycle and password hashing warning posture            | `shipped` | FastAPI startup and shutdown now run through lifespan, and password hashing and verification now run through direct Argon2 helpers.                           |
| Worker and analytics   | Scheduled analytics aggregation                                   | `shipped` | The worker now computes hourly task snapshots from Postgres and persists the latest snapshot plus a rolling Redis history instead of returning a placeholder. |
| Package contracts      | Shared auth and task TypeScript contract alignment                | `shipped` | `@taskflow/shared` now reflects live auth/task fields and web auth/task helpers consume shared package types instead of stale local duplicates.               |
| Quality and validation | Task UI component test coverage                                   | `shipped` | The task UI slice now has behavioral Vitest coverage across the error, loading, empty, filter, form, card, list, page-header, and SVG surfaces.               |
| Quality and validation | Web end-to-end coverage                                           | `shipped` | `apps/web/e2e` now covers public/auth smoke paths plus authenticated task CRUD, pagination transitions, and task-detail navigation.                           |
| Quality and validation | Dependency vulnerability triage baseline                          | `shipped` | Python requirements audit cleanly, npm audit is clean, the web app runs on `next@16.2.6`, the GraphQL codegen stack is patched, and repo validation passes.   |
| Data contract          | Alembic and SQLAlchemy column alignment                           | `shipped` | The migration history now upgrades task and user tables onto the same snake_case database contract that the live SQLAlchemy models expect.                    |
| Repo workflow          | Canonical runtime, planning, grouped commits, and signed delivery | `shipped` | The overhaul established the repo-level `make` contract, docs-first workflow, commit verification, and CI alignment.                                          |
