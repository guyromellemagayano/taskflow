# Runtime Architecture

## Canonical Local Runtime

TaskFlow uses a split but explicit runtime model:

- Node + pnpm on the host for JavaScript and TypeScript tooling
- Docker Compose for service runtime
- Make as the canonical orchestration surface

## Source Of Truth

- `.nvmrc` defines the required Node version
- `packageManager` and `engines` in the root `package.json` define the pnpm contract
- `.npmrc` defines repo-local package-manager behavior
- `requirements*.txt` define Python runtime dependencies
- `pyproject.toml` files are for Python tool configuration only

## Canonical Commands

- `./scripts/devops/run-make.sh bootstrap`
- `./scripts/devops/run-make.sh doctor`
- `./scripts/devops/run-make.sh up`
- `./scripts/devops/run-make.sh dev`
- `./scripts/devops/run-make.sh validate`
- `./scripts/devops/run-make.sh release-check`

Use plain `make` when the shell is already on the correct Node version.

## Validation Contract

- `format-check`: Prettier plus Python format checks
- `check-types`: workspace TypeScript checks
- `lint`: JS lint plus Python Ruff checks
- `test`: web, API, and worker tests or smoke fallbacks
- `build`: JS builds plus image builds
- `validate`: the full local baseline
- `verify-commit`: verify the current `HEAD` signature
- `release-check`: validation plus diff hygiene before grouped release commits
