# Runtime Architecture

## Canonical Local Runtime

TaskFlow uses a split but explicit runtime model:

- Node + pnpm on the host for JavaScript and TypeScript tooling
- Docker Compose for service runtime
- Make as the canonical orchestration surface

## Source Of Truth

- `.node-version` defines the required Node version
- `packageManager` and `engines` in the root `package.json` define the pnpm contract
- `pnpm-workspace.yaml` defines pnpm 11 install policies, build permissions, and dependency overrides
- `.npmrc` is reserved for registry configuration; credentials belong outside the repository
- The web Docker base pins the same Node version as `.node-version` and activates pnpm from root `packageManager`
- CI enables Corepack before initializing the pnpm dependency cache
- `requirements*.txt` define Python runtime dependencies
- `pyproject.toml` files are for Python tool configuration only

## Host Setup

Install mise (on macOS, `brew install mise`), enable Node version files with `mise settings add idiomatic_version_file_enable_tools node`, and run `mise install` in the repository. Interactive shells may activate mise; scripts and editor tasks use the launcher or `mise exec -- <command>`. Corepack selects pnpm from `packageManager`. CI may provide the exact Node version directly without mise.

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
