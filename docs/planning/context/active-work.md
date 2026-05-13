# TaskFlow Active Work

## Purpose

This file is the live execution control surface for current delivery work.

## Active Initiative

- Status: `Ready For Next Slice`
- Current active feature spec: `None`
- Current slice: Contract truth hardening
- Current scope: start the next approved follow-through slice after unified browser session transport

## Most Recently Completed Initiative

- Initiative: Unified browser session transport
- Feature spec: [`../feature-specs/cross-cutting/unified-browser-session-transport.md`](../feature-specs/cross-cutting/unified-browser-session-transport.md)
- Outcome: browser auth now uses same-origin `/graphql` and `/api` cookie transport as the primary path, while bearer tokens remain as a legacy and non-browser fallback

## Next Approved Candidate Specs

- Broader package-boundary cleanup for remaining workspace packages

## Latest Validation

- Completed locally on May 13, 2026 through `pnpm --filter @taskflow/web test:e2e`, `pnpm --filter @taskflow/web test:run`, `pnpm --filter @taskflow/web type-check`, targeted API `py_compile`, targeted API `ruff check`, API compile/import smoke, and `docker compose config -q`

## Blockers

- None.
