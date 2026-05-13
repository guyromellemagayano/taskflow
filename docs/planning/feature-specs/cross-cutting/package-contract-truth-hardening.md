# Delivery: Package Contract Truth Hardening

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

`@taskflow/shared` drifted from the live API contract and web usage. The shared user type still exposed fields the API does not return, and web auth/task surfaces were duplicating local types instead of consuming the shared package contract.

## Operator Outcome

Contributors should be able to rely on `@taskflow/shared` as the canonical contract for web auth and task TypeScript types without stale fields or duplicate local interfaces.

## Scope

- align shared user and task type definitions with the live GraphQL/API contract
- add shared task filter and input types used by web task operations
- wire web auth and web task GraphQL type surfaces to consume shared types
- remove shared type export ambiguity between `types.ts` and `validation.ts`

## Non-Goals

- redesigning web auth transport behavior between GraphQL and REST endpoints
- changing API schema fields
- broad package boundary refactors for unrelated workspace packages

## Boundaries

- `packages/shared/src/types.ts`
- `packages/shared/src/validation.ts`
- `apps/web/src/lib/auth/context.tsx`
- `apps/web/src/lib/graphql/tasks.ts`
- planning and status docs touched by this slice

## Acceptance Checks

- shared `User` contract matches the fields returned by auth GraphQL payloads
- web auth context and task GraphQL type helpers consume shared contracts
- shared package no longer exports conflicting type names from different modules
- `pnpm --filter @taskflow/shared type-check`
- `pnpm --filter @taskflow/shared lint`
- `pnpm --filter @taskflow/web type-check`
- `./scripts/devops/run-make.sh validate`

## Validation Plan

- tighten shared type definitions to live API truth
- keep validation-inferred types distinct from canonical shared contract names
- run targeted shared and web checks before full repo validation

## Validation Outcome

- `pnpm --filter @taskflow/shared type-check`
- `pnpm --filter @taskflow/shared lint`
- `pnpm --filter @taskflow/web type-check`
- `./scripts/devops/run-make.sh validate`
