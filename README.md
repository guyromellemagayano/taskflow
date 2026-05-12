# TaskFlow

TaskFlow is a polyglot product monorepo with a Next.js frontend, a FastAPI GraphQL API, and a Celery worker. The repository now uses one default workflow for runtime setup, planning, validation, grouped commits, and signed delivery.

## Stack

- `apps/web`: Next.js App Router + React + TypeScript
- `apps/api`: FastAPI + Strawberry GraphQL + SQLAlchemy + Alembic
- `apps/worker`: Celery + Redis
- `packages/*`: shared TypeScript packages and repo config packages

## Canonical Workflow

Use the repo wrapper when you want the shell to honor the repo Node version automatically:

```bash
./scripts/devops/run-make.sh doctor
./scripts/devops/run-make.sh bootstrap
./scripts/devops/run-make.sh up
./scripts/devops/run-make.sh validate
```

Use plain `make` when your shell is already on the correct Node version from `.nvmrc`.

## Quick Start

1. Install or activate the required Node version:

   ```bash
   nvm install
   nvm use
   corepack enable
   ```

2. Bootstrap the local repo:

   ```bash
   ./scripts/devops/run-make.sh bootstrap
   ```

3. Start the local runtime:

   ```bash
   ./scripts/devops/run-make.sh up
   ```

4. Validate the current checkout:

   ```bash
   ./scripts/devops/run-make.sh validate
   ```

## Canonical Commands

- `make doctor`
- `make bootstrap`
- `make up`
- `make dev`
- `make down`
- `make logs`
- `make urls`
- `make db-migrate`
- `make format-check`
- `make check-types`
- `make lint`
- `make test`
- `make build`
- `make validate`
- `make release-check`
- `make verify-commit`

## Planning And Release Workflow

TaskFlow now uses this default non-trivial workflow:

1. define the product slice
2. place it in the phase plan
3. write or update the feature spec
4. mark the active slice
5. implement in bounded file or folder groups
6. validate
7. create a grouped signed commit
8. verify the commit locally
9. push

Read the canonical docs in [docs/README.md](./docs/README.md) before non-trivial work.
