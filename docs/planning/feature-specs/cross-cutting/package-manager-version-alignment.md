# Delivery: Package Manager Version Alignment

## Status

- Type: `Runtime`
- Status: `Completed`

## Problem

Local version bumps select Node 24.17.0 and pnpm 11.22.0, but root engines and Docker still select the previous versions. pnpm 11 also ignores the legacy package.json pnpm overrides and non-registry .npmrc settings.

## Operator Outcome

Host tooling, CI, and the web Docker build use the same declared Node and pnpm contract, with security overrides and install policies still applied.

## Scope

- align root engines with .nvmrc and packageManager
- migrate pnpm settings and overrides to pnpm-workspace.yaml
- migrate dependency build policy to allowBuilds
- derive Docker pnpm activation from packageManager
- preserve frozen-lockfile installation and validate the resulting runtime

## Non-Goals

- upgrading application dependencies or changing product behavior
- broader package-boundary cleanup

## Boundaries

- .nvmrc, package.json, .npmrc, pnpm-workspace.yaml, pnpm-lock.yaml
- apps/web/Dockerfile, scripts/devops/doctor.sh, and .github/workflows/ci.yml
- runtime architecture and planning context

## Affected Surfaces

- host Node/pnpm tooling, CI installation, web image builds, security overrides

## Acceptance Checks

- Node engines equal .nvmrc without the v prefix
- pnpm engines equal the packageManager version
- Docker activates pnpm from packageManager and CI enables Corepack before caching
- pnpm reads the existing overrides and migrated install settings without legacy warnings
- frozen-lockfile install and canonical release checks pass

## Validation Plan

- inspect effective pnpm settings and run pnpm install --frozen-lockfile
- run ./scripts/devops/run-make.sh doctor and release-check
- run the documented JavaScript and Python dependency audits
- check diff hygiene and verify signed commits before pushing

## References

- [pnpm migration guide](https://pnpm.io/migration)

## Validation Outcome

- October 14, 2026: `pnpm install --frozen-lockfile` passed without changing `pnpm-lock.yaml`.
- Runtime doctor confirmed Node 24.17.0, pnpm 11.22.0, matching engines, the exact Docker Node version, and valid Compose configuration.
- Effective pnpm configuration matches all existing security overrides and disabled dependency-build scripts; strict engine and package-manager settings are active.
- `./scripts/devops/run-make.sh release-check` passed after the separately scoped graphql-core compatibility constraint: formatting, types, lint, 25 JavaScript tests, 7 API tests, 4 worker tests, production builds, and all service image builds.
- Docker activated pnpm 11.22.0 from root `packageManager` and completed frozen-lockfile installation.
- JavaScript audit reported 9 low, 33 moderate, 47 high, and 4 critical findings against the unchanged dependency lockfile. Python audit reported 11 findings across 3 packages before and after the graphql-core constraint. Wider remediation remains separate hardening work.
- Changed-file Prettier checks and `git diff --check` passed.
