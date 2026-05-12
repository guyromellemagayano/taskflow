# TaskFlow Phase Plan

## Purpose

This file owns implementation order and current status for the TaskFlow monorepo overhaul.

## Current Phase Status

| Phase   | Status       | Definitive interpretation                                                                                                                         |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 | Implementing | Root runtime and tooling contract are being reset around Node, pnpm, Docker Compose, Make, and canonical validation.                              |
| Phase 2 | Implementing | Planning, governance, and docs-first workflow surfaces are being established as the default repo contract.                                        |
| Phase 3 | Implementing | Signed delivery, grouped commit rules, release confidence commands, and CI are being aligned to the same local workflow.                          |
| Phase 4 | Planned      | Shared package boundaries, GraphQL/codegen truth, and cross-package contract cleanup will follow the foundation reset.                            |
| Phase 5 | Planned      | Migration-model alignment, Python contract hardening, and deeper automation or integration surfaces will follow once the base workflow is stable. |

## Phase Details

### Phase 1: Runtime Contract Reset

- Core focus: `.nvmrc`, `.npmrc`, `packageManager`, `engines`, `turbo.json`, `Makefile`, `scripts/devops/*`, Dockerfile alignment

### Phase 2: Planning And Governance

- Core focus: `AGENTS.md`, `.cursor/rules/*`, docs tree, feature-spec workflow, active-work tracking

### Phase 3: Release Confidence

- Core focus: grouped commits, signed verification, commit validation, `make release-check`, CI mirroring local validation

### Phase 4: Package And Contract Truth

- Core focus: shared package ownership, config exports, GraphQL/codegen authority, import and package-boundary cleanup

### Phase 5: Runtime Hardening

- Core focus: migration-model alignment, Python service testing depth, service contract drift reduction, automation hardening

## Sequencing Constraints

- Phase 1 must land before later phases can be trustworthy.
- Phase 2 and Phase 3 should be established before wide feature work resumes, because they define how work is sliced, validated, committed, and pushed.
- Phase 4 and Phase 5 should use the new workflow contract rather than inventing local exceptions.
