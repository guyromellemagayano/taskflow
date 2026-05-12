# TaskFlow Module Feature Checklist

Use this file to record whether a module capability is shipped, partial, planned, or needs hardening.

## Status Meanings

- `shipped`: part of the current canonical product or repo contract
- `partial`: present but constrained, placeholder-backed, or missing follow-through
- `planned`: intentionally not shipped yet
- `needs-hardening`: shipped-adjacent contract drift or quality debt that should be corrected

## Current Module Status

| Module                 | Capability                                                        | Status            | Notes                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App shell              | Public landing page with API connectivity status                  | `shipped`         | `/` reports API availability and links to operational endpoints instead of acting as a full dashboard.                                                          |
| Auth and sessions      | Email-and-password sign-up                                        | `shipped`         | Backed by the GraphQL `register` mutation and the `/signup` page.                                                                                               |
| Auth and sessions      | Login, refresh, current-user bootstrap, and logout                | `shipped`         | The web app uses GraphQL auth flows and the API also exposes REST login, refresh, and logout endpoints.                                                         |
| Auth and sessions      | Unified browser session transport                                 | `needs-hardening` | Browser auth currently mixes GraphQL token persistence with separate REST cookie-setting auth endpoints.                                                        |
| Task workspace         | Create, edit, delete, and status-change task flows                | `shipped`         | The `/tasks` workspace supports task CRUD and inline state changes.                                                                                             |
| Task workspace         | Search, filter, sort, and URL-synced list state                   | `shipped`         | Status, priority, search, sort field, and sort order are reflected in the URL.                                                                                  |
| Task workspace         | Pagination metadata and dedicated pagination controls             | `partial`         | The hooks and service layer support `limit` and `offset`, but the GraphQL query returns a plain list and the UI has no dedicated paging controls.               |
| Task workspace         | Single-task detail experience                                     | `planned`         | GraphQL exposes `task(id)`, but there is no web route or detail page yet.                                                                                       |
| API and operations     | Root, API info, health, readiness, and metrics endpoints          | `shipped`         | The API exposes operational endpoints alongside GraphQL and auth routes.                                                                                        |
| API and operations     | GraphQL task and auth surfaces                                    | `shipped`         | Queries and mutations exist for tasks, current user, registration, login, refresh, and logout.                                                                  |
| Worker and analytics   | Scheduled analytics aggregation                                   | `partial`         | The worker beat schedule exists, but the analytics task body is still a TODO scaffold.                                                                          |
| Quality and validation | Task UI component test coverage                                   | `partial`         | Test files exist for the task UI slice, but they are placeholder `todo` suites rather than behavioral tests.                                                    |
| Quality and validation | Web end-to-end coverage                                           | `planned`         | Playwright config exists, but `apps/web/e2e` does not exist yet.                                                                                                |
| Quality and validation | Dependency vulnerability triage baseline                          | `partial`         | Python requirements audit cleanly, the web app runs on `next@16.2.6`, and repo validation passes, but npm still carries the blocked GraphQL codegen advisories. |
| Data contract          | Alembic and SQLAlchemy column alignment                           | `needs-hardening` | The initial migration still uses camelCase database columns while the live models map snake_case column names.                                                  |
| Repo workflow          | Canonical runtime, planning, grouped commits, and signed delivery | `shipped`         | The overhaul established the repo-level `make` contract, docs-first workflow, commit verification, and CI alignment.                                            |
