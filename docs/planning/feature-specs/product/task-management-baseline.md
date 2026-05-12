# Task Management Baseline

## Purpose

Define the main TaskFlow product slice: an authenticated workspace where a user can manage personal tasks.

## Intended Outcome

- A signed-in user can create, update, complete, reprioritize, reschedule, search, sort, and delete tasks from one page.
- The API and web client share a clear task contract for task CRUD and list retrieval.
- The initial task surface stays narrow and list-centric instead of expanding into multiple unfinished views.

## Delivered Scope

- Task model and service layer for CRUD operations and user scoping.
- GraphQL queries and mutations for task list retrieval, single-task lookup, create, update, and delete.
- `/tasks` page with task creation, task editing, delete confirmation, inline status changes, empty state, loading state, and error state.
- URL-synced search, filter, and sort controls.
- Optimistic updates in the web client for task creation, updates, and deletion.

## Constraints Carried Forward

- The list contract uses `limit` and `offset`, but the current GraphQL query still returns a plain list instead of connection metadata.
- There is no dedicated task detail route even though the API exposes `task(id)`.
- The task UI test files currently document missing coverage rather than supplying full behavioral tests.

## Follow-On Work

- Decide whether task pagination should remain list-based or move to a real connection contract.
- Add a dedicated task detail experience only if it improves the actual workflow instead of fragmenting the current list-first surface.
- Replace placeholder UI tests with real behavioral and browser coverage.
