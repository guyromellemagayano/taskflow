# Delivery: Monorepo Foundation Overhaul

## Status

- Type: `Delivery`
- Status: `Completed`

## Problem

TaskFlow needs a stable, scalable, and maintainable monorepo contract without changing its primary frontend or backend stacks. The existing repo surfaces are too loose to support reliable release slices, grouped commits, or signed delivery.

## Operator Outcome

The repository should have one default workflow for planning, implementation, validation, grouped commits, and pushes. Contributors should not need to guess which command surface or planning rule is authoritative.

## Scope

- reset the root runtime contract
- establish docs-first planning and governance
- define grouped commit and signed delivery rules
- align local validation and CI around the same contract

## Non-Goals

- changing the primary app stacks
- redesigning the product feature set
- expanding provider or integration scope beyond repo workflow and runtime hardening

## Boundaries

- root orchestration
- developer workflow and local runtime
- CI and release hygiene
- package-governance guardrails

## Affected Surfaces

- `AGENTS.md`
- `.cursor/rules/*`
- `docs/*`
- `Makefile`
- `scripts/devops/*`
- Husky hooks and commit validation
- `.github/workflows/ci.yml`
- root runtime config files

## Acceptance Checks

- `make doctor` is the canonical prerequisite check
- `make validate` runs the accepted local baseline
- non-trivial work has a planning chain and active-work surface
- grouped commit structure is validated locally
- signed commits can be verified locally through the repo contract
- CI runs the same validation contract as local development

## Validation Plan

- `make doctor`
- `make validate`
- `make release-check`
- focused fixes for any issues surfaced by the new baseline
