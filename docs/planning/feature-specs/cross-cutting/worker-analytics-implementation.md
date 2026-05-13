# Delivery: Worker Analytics Implementation

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

TaskFlow's worker beat schedule existed, but the analytics task body was still a placeholder. That left background processing as an orchestration shell without a real analytics contract, and it meant the repo docs were overstating what the worker actually delivered.

## Operator Outcome

Contributors should be able to run the hourly analytics job and get a real Redis-backed task snapshot generated from Postgres instead of a static success response.

## Scope

- replace the placeholder worker analytics task body with a real aggregation flow
- query Postgres for task counts that match the current task model contract
- persist the latest snapshot and a rolling history in Redis
- cover the worker analytics path with real worker-side tests
- align the worker's local database default with the repo's canonical local runtime port

## Non-Goals

- building a user-facing analytics dashboard
- exposing a public API or GraphQL analytics query surface in this slice
- redesigning the worker runtime beyond what is needed to make analytics truthful

## Boundaries

- `apps/worker/tasks/analytics.py`
- `apps/worker/services/*`
- `apps/worker/tests/*`
- `apps/worker/config/settings.py`
- planning and product docs touched by this slice

## Acceptance Checks

- the Celery analytics task returns a real task snapshot instead of a placeholder success payload
- the worker stores the latest analytics snapshot plus a bounded rolling history in Redis
- worker-side tests cover the aggregation and persistence contract
- `./scripts/devops/run-make.sh test-worker`
- `./scripts/devops/run-make.sh validate`

## Validation Plan

- add a worker-local analytics service so the Celery task stays thin
- cover snapshot generation and Redis persistence with worker-side tests
- run targeted worker validation first
- finish with the canonical repo validation contract

## Validation Outcome

- `./scripts/devops/run-make.sh test-worker`
- `./scripts/devops/run-make.sh validate`
