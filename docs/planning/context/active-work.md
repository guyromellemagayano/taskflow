# TaskFlow Active Work

## Purpose

This file is the live execution control surface for current delivery work.

## Active Initiative

- Status: `Ready For Next Slice`
- Current active feature spec: `None`
- Current slice: Contract truth hardening
- Current scope: start the next approved package-boundary follow-through slice

## Most Recently Completed Initiative

- Initiative: Runtime version alignment and contributor guidance cleanup
- Feature specs:
  - [`../feature-specs/cross-cutting/package-manager-version-alignment.md`](../feature-specs/cross-cutting/package-manager-version-alignment.md)
  - [`../feature-specs/cross-cutting/graphql-core-compatibility-constraint.md`](../feature-specs/cross-cutting/graphql-core-compatibility-constraint.md)
  - [`../feature-specs/cross-cutting/cursor-guidance-retirement.md`](../feature-specs/cross-cutting/cursor-guidance-retirement.md)
- Outcome: Node 24.17.0 and pnpm 11.22.0 agree across host declarations, Docker, and CI; pnpm policies and security overrides use the pnpm 11 configuration contract; API requirements constrain graphql-core to the compatible 3.2 line; Cursor guidance is retired with durable requirements retained in AGENTS.md and canonical docs.

## Next Approved Candidate Specs

- Broader package-boundary cleanup for remaining workspace packages

## Latest Validation

- October 14, 2026: runtime doctor, frozen-lockfile installation, effective pnpm settings, changed-file Prettier checks, Codex TOML parsing, and diff hygiene passed.
- `./scripts/devops/run-make.sh release-check` passed: formatting, TypeScript, lint, 25 JavaScript tests, 7 API tests, 4 worker tests, production builds, and API/worker/web image builds.
- Dependency audits report outstanding advisories, documented in `docs/development/dependency-security.md`: 93 JavaScript findings (including 4 critical) and 11 Python findings across 3 packages. Broad dependency remediation remains separate work.

## Blockers

- None for the delivered runtime and guidance slices.
