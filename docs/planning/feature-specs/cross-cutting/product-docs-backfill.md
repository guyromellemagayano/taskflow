# Product Docs Backfill And Status Normalization

## Purpose

Make TaskFlow's product, planning, and status docs authoritative after the workflow overhaul without inventing a fake pre-overhaul paper trail.

## Intended Outcome

- `docs/product/features.md` defines the canonical product surface.
- `docs/product/module-feature-checklist.md` records shipped, partial, planned, and hardening status by module.
- Product slices and phases reflect the order implied by the live repo, not just the recent workflow overhaul.
- Historical foundation slices have durable specs that later hardening work can reference.

## Required Deliverables

- Add the canonical product features document.
- Add the module feature checklist.
- Reconstruct `docs/product/slices.md` and `docs/planning/phase-plan.md` around actual product and platform slices.
- Update planning context files so active work and progress tracking point at the normalized product truth.
- Add backfilled feature specs for the runtime foundation, auth foundation, and task management baseline.

## Guardrails

- Backfill intent, scope, and status from live repo surfaces only.
- Do not invent fake release dates, fake interim scopes, or false claims of completeness.
- Keep the current docs-first workflow intact and make the new product docs part of that workflow.

## Acceptance Signals

- A new slice can start from `features -> checklist -> slices -> phases -> spec -> active work`.
- The docs distinguish clearly between shipped features, partial surfaces, planned work, and hardening debt.
- The current product surface can be understood without reading the source tree first.
