# TaskFlow Standards

## Persona

- Treat the user as the architecture owner of a polyglot product monorepo.
- Be direct, concrete, and execution-focused.
- Prefer code, docs, and verified behavior over speculative guidance.

## TaskFlow Context

- Frontend: Next.js App Router + React + TypeScript in `apps/web`.
- Backend: FastAPI + Strawberry GraphQL + SQLAlchemy + Alembic in `apps/api`.
- Worker: Celery + Redis in `apps/worker`.
- Workspace packages: `@taskflow/*` under `packages/`.
- Root runtime contract: Node + pnpm on the host, Docker Compose for service runtime, `make` as the canonical control plane.
- Python dependency contract: `requirements*.txt` files are the runtime dependency source of truth; `pyproject.toml` files are tool-configuration surfaces only.

## Instruction Hierarchy

1. `AGENTS.md`
2. `.cursor/rules/*.mdc`
3. `.cursor/skills/*` (reference only)

When local guidance conflicts, `AGENTS.md` and `.cursor/rules/*.mdc` win.

## Canonical Planning Authority

- For any non-trivial feature, refactor, workflow change, schema change, cross-package edit, release change, or architecture decision, use the canonical docs under `docs/`.
- Required read path for non-trivial work:
  - `docs/README.md`
  - `docs/product/slices.md`
  - `docs/planning/phase-plan.md`
  - the relevant architecture or development doc
  - `docs/planning/spec-driven-development.md`
  - the relevant files in `docs/planning/context/`
  - the active or proposed feature spec in `docs/planning/feature-specs/`
  - `docs/planning/context/active-work.md`
- If docs are stale, update docs before or alongside code changes.

## Feature Spec Gate

- No non-trivial implementation starts without a feature spec.
- Use a `Delivery` feature spec for active implementation work.
- Each feature spec must define the problem, operator outcome, scope, non-goals, boundaries, affected surfaces, acceptance checks, and validation plan.

## Live Engineering Gate

- `docs/planning/context/active-work.md` is the live execution surface for the current slice.
- Update it when work starts, when scope changes, after meaningful validation, and before handoff.
- Update `docs/planning/context/progress-tracker.md` when a meaningful slice lands or the approved next-work queue changes.

## Core Working Principles

1. Keep the repo contract boring and explicit.
2. Use product slices, then phases, then subphases only when they map to real boundaries.
3. Group commits by responsibility or slice first; folders are only a heuristic.
4. Signed commits and local verification are part of the release workflow, not an optional extra.

## Package Governance

- External dependency versions belong in `pnpm-workspace.yaml` under `catalog:`.
- Internal `@taskflow/*` dependencies use `workspace:*`.
- Root `package.json` is for repo orchestration only.
- Shared config artifacts must be consumed through package exports such as `@taskflow/config-typescript/base.json`, not internal `src/*` paths.
- Prefer adding a new workspace package only when the boundary is real and reusable.

## Runtime Defaults

- Use `./scripts/devops/run-make.sh` when invoking the canonical runtime targets from a shell session that may not already be on the right Node version.
- Use `make` for the canonical runtime and validation flow:
  - `make bootstrap`
  - `make doctor`
  - `make up`
  - `make dev`
  - `make check-types`
  - `make lint`
  - `make test`
  - `make build`
  - `make validate`
  - `make release-check`
  - `make verify-commit`

## Validation And Release Workflow

- Validate narrowly first when the change is local.
- Run `make validate` when shared behavior or release confidence matters.
- Create grouped commits with `type(scope): summary`, one blank line, and dash-prefixed bullets only.
- Sign grouped commits with `git commit -S`.
- Verify locally with `git verify-commit HEAD` before pushing.
