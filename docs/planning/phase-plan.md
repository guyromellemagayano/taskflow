# TaskFlow Phase Plan

## Purpose

This file owns implementation order and current status for TaskFlow's canonical product and platform delivery order.

## Current Phase Status

| Phase   | Status       | Definitive interpretation                                                                                                               |
| ------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 | Shipped      | The repo has a working web, API, and worker foundation with operational endpoints and the baseline local runtime shape.                 |
| Phase 2 | Shipped      | Account creation, login, session bootstrap, refresh, and logout exist across the current web and API surfaces.                          |
| Phase 3 | Shipped      | Task CRUD and the authenticated list workspace exist as the main product surface.                                                       |
| Phase 4 | Partial      | Task UX hardening and background analytics have started, but pagination truth, analytics depth, and test coverage are not yet complete. |
| Phase 5 | Shipped      | The monorepo workflow overhaul established the canonical runtime, planning, validation, grouped-commit, and signed-delivery contract.   |
| Phase 6 | Implementing | Product features, checklist, slices, phase status, and historical foundation specs are being normalized from live repo truth.           |
| Phase 7 | Planned      | Data contracts, test depth, worker implementation, and remaining package truth issues will be hardened under the new workflow contract. |

## Phase Details

### Phase 1: Runtime And Application Foundation

- Core focus: initial web shell, FastAPI app, operational endpoints, database wiring, Redis support, and Celery worker baseline

### Phase 2: Authentication And Session Foundation

- Core focus: user model, registration, login, `me`, refresh-token rotation, logout, and tasks-route gating

### Phase 3: Task Management Baseline

- Core focus: task model, GraphQL CRUD, task service layer, authenticated task page, and basic list interactions

### Phase 4: Task Experience And Async Scaffolding

- Core focus: filtering, search, sorting, optimistic updates, delete confirmation, and scheduled analytics scaffolding

### Phase 5: Workflow And Release Overhaul

- Core focus: runtime contract reset, docs-first workflow, grouped commits, signed verification, and CI alignment

### Phase 6: Product Docs Backfill

- Core focus: canonical product/features docs, module status normalization, reconstructed slice and phase order, and historical foundation specs

### Phase 7: Contract Truth Hardening

- Core focus: migration-model alignment, real web coverage, task detail and pagination truth, worker analytics implementation, and package-boundary hardening

## Sequencing Constraints

- Phases 1 through 4 define the reconstructed product build order implied by the live repo and should be treated as the baseline product history from now on.
- Phase 5 establishes the workflow contract and must remain the gate for new non-trivial work.
- Phase 6 makes the backfilled docs authoritative so later slices do not drift from repo truth again.
- Phase 7 must use the current docs-first workflow rather than inventing one-off exceptions.
