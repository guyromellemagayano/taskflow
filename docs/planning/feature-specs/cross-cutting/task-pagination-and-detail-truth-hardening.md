# Delivery: Task Pagination And Detail Truth Hardening

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

TaskFlow's task workspace still advertises pagination-aware behavior without a truthful end-to-end contract. The API service layer can count and page results, the GraphQL schema already declares a paginated connection type, and the web hook exposes pagination-oriented options, but the live `tasks` query still returns a plain list and the `/tasks` page hardcodes a single fixed page. The API also exposes `task(id)`, but the web surface does not yet make that single-task view useful.

## Operator Outcome

Contributors should be able to rely on one honest task retrieval contract: the GraphQL API returns paginated task metadata, the web workspace drives page state from the URL, and the existing single-task lookup becomes a usable read path in the web app.

## Scope

- return paginated task metadata from GraphQL using the existing connection shape
- consume that metadata in the web task hook and `/tasks` page
- add a stable, minimal task detail route that uses the existing `task(id)` query
- keep the slice list-first and avoid building a second full editing workflow outside the workspace

## Non-Goals

- replacing offset pagination with cursor pagination
- introducing a full task dashboard or multi-pane workspace redesign
- duplicating create, edit, and delete flows across both the list page and detail page

## Boundaries

- `apps/api/app/graphql/schema.py`
- `apps/api/app/services/task_service.py`
- `packages/graphql/schema.graphql`
- `apps/web/src/lib/graphql/tasks.ts`
- `apps/web/src/lib/hooks/useTasks.ts`
- `apps/web/src/lib/hooks/useTaskFilters.ts`
- `apps/web/src/app/tasks/*`
- task UI components and tests needed to make the new pagination/detail surfaces truthful

## Acceptance Checks

- the GraphQL `tasks` field returns task items plus pagination metadata
- the `/tasks` page reads page state from the URL and renders truthful paging controls
- filter and sort changes reset paging state instead of leaving stale offsets behind
- the existing `task(id)` GraphQL query is reachable from the web app through a dedicated route
- `pnpm --filter @taskflow/web test:run`
- `pnpm build`

## Validation Plan

- patch the GraphQL contract and schema snapshot together
- run targeted web unit coverage for pagination/detail components
- run the web test suite and production build
- verify the repo contract still reflects the task workspace honestly after the slice

## Validation Outcome

- `pnpm format:check`
- `pnpm check-types`
- `pnpm lint`
- `pnpm build`
- `pnpm --filter @taskflow/web test:run`
- `pnpm --filter @taskflow/web test:e2e`
