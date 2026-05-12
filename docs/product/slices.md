# TaskFlow Product Slices

This document defines the release slices that now drive TaskFlow delivery.

## Slice 1: Monorepo Foundation Hardening

- Outcome: a stable root runtime contract for Node, pnpm, Docker Compose, Make, and repository-level validation
- Primary surfaces: `.nvmrc`, `.npmrc`, `package.json`, `turbo.json`, `Makefile`, `scripts/devops/*`, Dockerfiles, CI

## Slice 2: Planning And Governance Contract

- Outcome: product-slice planning, phase tracking, active-work control, and repository rules become the default workflow
- Primary surfaces: `AGENTS.md`, `.cursor/rules/*`, `docs/`

## Slice 3: Release Confidence And Signed Delivery

- Outcome: grouped commits, signed commit verification, release validation, and CI use the same local contract
- Primary surfaces: Husky hooks, commit validation, `make release-check`, `make verify-commit`, `.github/workflows/ci.yml`

## Slice 4: Package And Contract Truth

- Outcome: shared packages, GraphQL generation, TypeScript config exports, and workspace boundaries become honest and maintainable
- Primary surfaces: `packages/*`, codegen configuration, TypeScript config exports, cross-package imports

## Slice 5: Runtime Boundary Hardening

- Outcome: API, worker, migrations, and service contracts stop drifting from each other and become easier to evolve safely
- Primary surfaces: Alembic migrations, SQLAlchemy models, Python tests, container runtime rules

## Slice 6: Automation And Integration Surfaces

- Outcome: CI, smoke checks, agent rules, and developer integrations reinforce the repo contract instead of bypassing it
- Primary surfaces: CI workflows, validation helpers, local automation, repo governance surfaces
