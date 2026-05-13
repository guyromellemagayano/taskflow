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

- The task workspace remains list-first even though a dedicated read-only task detail route now exists.
- Offset pagination and connection metadata are now truthful, but the UI still uses a simple pager rather than a richer task-navigation experience.
- Browser coverage exists, but authenticated task CRUD and pagination flows still need deeper follow-through.

## Follow-On Work

- Decide whether offset pagination should remain the long-term contract or move to a cursor-based connection later.
- Deepen the task detail experience only if it improves the current list-first workflow instead of duplicating editing surfaces.
- Extend browser coverage into authenticated task CRUD and pagination paths.
