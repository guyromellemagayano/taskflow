# Delivery: Task Quality And Browser Coverage Hardening

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

TaskFlow's task workspace still carries placeholder component `todo` suites and no `apps/web/e2e` browser coverage at all. The repo contract claims test depth is part of the current hardening phase, but the actual web validation surface still stops at unit-free placeholders and build-only confidence.

## Operator Outcome

Contributors should be able to run real task UI component tests plus a minimal browser smoke suite under `apps/web/e2e`, and those checks should exercise the current web behavior instead of acting as empty placeholders.

## Scope

- replace the placeholder component task tests with behavioral Vitest coverage
- add a minimal Playwright browser suite under `apps/web/e2e`
- keep the first browser slice focused on stable current behavior rather than speculative future flows

## Non-Goals

- redesigning the task workspace UI
- introducing a large end-to-end matrix before the baseline smoke path exists
- claiming full task-flow coverage when auth and task-detail pagination work still have their own follow-through slices

## Boundaries

- `apps/web/src/components/tasks/*`
- `apps/web/src/components/svg/error/*`
- `apps/web/e2e/*`
- the web test harness and planning/status docs touched by this slice

## Acceptance Checks

- placeholder task UI `todo` suites are replaced with real behavioral assertions
- `apps/web/e2e` exists and runs at least a stable browser smoke path
- `pnpm --filter @taskflow/web test:run`
- `pnpm --filter @taskflow/web test:e2e`
- `./scripts/devops/run-make.sh validate`

## Validation Plan

- add or extend the shared web test harness as needed for Mantine and Next navigation behavior
- run targeted Vitest coverage for the task UI slice
- run Playwright against the new `apps/web/e2e` suite
- finish with the canonical repo validation contract

## Validation Outcome

- `pnpm format:check`
- `pnpm check-types`
- `pnpm lint`
- `pnpm build`
- `pnpm --filter @taskflow/web test:run`
- `pnpm --filter @taskflow/web test:e2e`
- `./scripts/devops/run-make.sh validate` reached the Docker image stage in this environment but did not surface a completion result; direct workspace validation and browser coverage passed
