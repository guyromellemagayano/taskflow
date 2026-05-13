# Delivery: Authenticated Browser Coverage

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

The current Playwright suite only covers public smoke paths and unauthenticated
task-route redirect behavior. It does not exercise the authenticated task
workspace flows that now define the product surface: task CRUD, paging, and
single-task detail navigation.

## Operator Outcome

Contributors should be able to run a stable browser suite that proves the
authenticated task workspace can create, edit, delete, paginate, and open task
detail views without requiring manual backend setup for every browser run.

## Scope

- add authenticated Playwright coverage under `apps/web/e2e`
- cover task create, edit, status change, and delete behavior through the UI
- cover task pagination URL transitions and single-task detail navigation
- keep the suite deterministic by mocking the GraphQL browser boundary
- update planning status docs after validation

## Non-Goals

- replacing API integration tests or backend validation
- redesigning the task workspace UI
- unifying GraphQL and REST browser session transport
- building a broad cross-browser matrix beyond the existing Playwright projects

## Boundaries

- `apps/web/e2e/*`
- task UI accessibility hooks needed for stable browser selectors
- planning and status docs touched by this slice

## Acceptance Checks

- authenticated browser tests cover task CRUD through the workspace
- authenticated browser tests cover pagination URL state and task detail routing
- public smoke tests continue to pass
- `pnpm --filter @taskflow/web test:e2e`
- `pnpm --filter @taskflow/web test:run`

## Validation Plan

- add deterministic GraphQL request handling inside the Playwright suite
- prefer accessible selectors for task cards and controls
- run Playwright first, then the focused web Vitest suite

## Validation Outcome

- `pnpm --filter @taskflow/web test:e2e`
- `pnpm --filter @taskflow/web test:run`
- `pnpm --filter @taskflow/web type-check`
