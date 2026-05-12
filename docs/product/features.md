# TaskFlow Product Features

This file defines the canonical TaskFlow product surface as of May 12, 2026. It is the baseline contract that slices, phases, specs, and release work should map to from now on.

## Core Product Outcome

- TaskFlow gives an authenticated user one place to create, organize, update, and complete personal tasks.
- The current product surface is intentionally narrow: account access, a task workspace, and the platform capabilities required to run and observe that workspace.

## Primary User Journeys

- Sign up with an email address and password.
- Log in, restore a session, refresh tokens, and log out safely.
- Open the authenticated task workspace and see only the current user's tasks.
- Create, edit, reprioritize, reschedule, complete, search, sort, and delete tasks.
- Confirm that the backing API is reachable and operational from the web surface.

## Feature Modules

### App Shell And Connectivity

- The public landing page reports API connectivity and exposes core operational endpoints.
- The authenticated task workspace lives at `/tasks`.
- The current shell is functional rather than dashboard-heavy.

### Account Access And Sessions

- Email-and-password sign-up is available from the web app.
- Email-and-password login is available from the web app.
- The web app restores the current user through the `me` GraphQL query.
- Refresh-token rotation and logout are part of the current auth contract.
- The repo currently carries both GraphQL auth mutations and REST auth endpoints because browser token persistence and cookie transport are not yet unified behind one path.

### Task Workspace

- Tasks can be created, edited, deleted, and marked through status changes.
- Tasks support title, description, status, priority, and due date fields.
- The task list supports search, status filtering, priority filtering, and sort order changes.
- Filter and sort state live in the URL so the list view is reproducible.
- The web client uses optimistic list updates for create, update, and delete flows.

### API And Operational Surfaces

- The API exposes GraphQL task and auth operations.
- The API also exposes REST auth endpoints for login, refresh, and logout.
- Root, API info, health, readiness, and metrics endpoints are part of the current runtime contract.
- Refresh tokens are stored and revoked through Redis-backed cache helpers.

### Background Processing

- A Celery worker and beat schedule exist for hourly analytics aggregation.
- Background analytics are currently a platform scaffold, not a finished user-facing feature.

## Not Yet Part Of The Canonical Product Surface

- A dedicated single-task detail page in the web app.
- GraphQL task connection metadata exposed to the web client as the main list contract.
- User-facing analytics dashboards or reports.
- Real end-to-end browser coverage as part of the shipped product baseline.
