# Dependency Security

## Purpose

This document records TaskFlow's current dependency-vulnerability posture and the default validation path for investigating default-branch security alerts.

## Current Status

Validated against live repo state on May 12, 2026.

- Python audit posture: `No known vulnerabilities found`
- npm audit posture: `0 low`, `1 moderate`, `2 high`, `0 critical`
- Canonical repo validation: `./scripts/devops/run-make.sh validate` passes

## Applied Hardening

### Python

- `apps/api/requirements.txt` now uses `fastapi==0.136.1`, `strawberry-graphql[fastapi]==0.315.3`, and `python-jose[cryptography]==3.5.0`
- `apps/api/requirements-dev.txt` now uses `pytest==9.0.3`, `pytest-asyncio==1.3.0`, and `black==26.3.1`
- `apps/worker/requirements-dev.txt` now uses `pytest==9.0.3` and `black==26.3.1`

### JavaScript

- Root overrides now pin patched transitive versions for `brace-expansion`, `fast-uri`, `flatted`, `lodash`, `minimatch`, `picomatch`, `postcss`, `rollup`, `undici`, and `yaml`
- The Vitest toolchain now runs on `vite@8.0.12`, `vitest@4.1.4`, `@vitejs/plugin-react@6.0.1`, `@vitest/coverage-v8@4.1.4`, `@vitest/ui@4.1.4`, and `@vitest/eslint-plugin@1.6.16`
- The web app and companion packages now run on the patched Next.js line: `next@16.2.6`, `@next/env@16.2.6`, `@next/eslint-plugin-next@16.2.6`, `eslint-config-next@16.2.6`, and `@next/bundle-analyzer@16.2.6`

### Web Runtime Surface

- The no-op Next proxy surface was removed by deleting `apps/web/proxy.ts`
- `apps/web/next.config.ts` disables the image optimization endpoint because the app does not use `next/image`
- The current app surface does not use middleware or proxy authorization, `next/image`, server actions, cache components, rewrites, WebSocket upgrades, or i18n routing

## Remaining Open Alerts

### GraphQL Codegen

- `pnpm audit` still recommends `@graphql-codegen/plugin-helpers@6.3.0` and `@graphql-codegen/visitor-plugin-common@6.3.0`
- Those target versions were not installable from the current registry view during this hardening pass
- The remaining path includes `@ardatan/relay-compiler` and `immutable~3.7.6`, which does not have a safe patch-only upgrade path available in the current dependency graph

## Default Validation Commands

- `pnpm audit --json | jq '{metadata: .metadata.vulnerabilities, actions: [.actions[]? | {action, module, target}]}'`
- `uvx --from pip-audit pip-audit -r apps/api/requirements.txt -r apps/api/requirements-dev.txt -r apps/worker/requirements.txt -r apps/worker/requirements-dev.txt`
- `./scripts/devops/run-make.sh validate`

## Follow-Through

- Upgrade the GraphQL codegen packages once `6.3.0` or later is installable here, then re-run codegen, builds, and audit
- Keep Python and npm audit checks part of release hardening whenever dependency manifests or lockfiles change
