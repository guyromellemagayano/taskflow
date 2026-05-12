SHELL := /bin/bash

.DEFAULT_GOAL := help

ROOT_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
COMPOSE := docker compose
WEB_PACKAGE := @taskflow/web
API_TEST_DIR := apps/api/tests
WORKER_TEST_DIR := apps/worker/tests

BOLD := \033[1m
BLUE := \033[34m
TEAL := \033[36m
YELLOW := \033[33m
GREEN := \033[32m
RESET := \033[0m

define announce
	@printf '\n$(BOLD)%s$(RESET)\n%s\n\n' "$(1)" "$(2)"
endef

.PHONY: help bootstrap doctor up dev down restart ps logs urls health shell-api shell-web shell-worker shell-postgres shell-redis db-migrate db-revision db-downgrade graphql-schema python-runtime-ready format format-check check-types lint test test-web test-backend test-worker test-e2e build validate release-check verify-commit clean clean-volumes

help: ## Show the canonical taskflow command surface.
	@printf '\n$(BOLD)TaskFlow commands$(RESET)\n\n'
	@awk 'BEGIN {FS = ":.*## "}; /^[a-zA-Z0-9_.-]+:.*## / {printf "  $(TEAL)%-18s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

bootstrap: ## Validate prerequisites, install JS dependencies, and build local images.
	$(call announce,Preparing local workspace,Validating the repo contract before installing dependencies and building images.)
	@$(MAKE) doctor
	@corepack enable
	@pnpm install --frozen-lockfile
	@$(COMPOSE) build api worker web
	@$(MAKE) urls

doctor: ## Validate Node, pnpm, Docker, Compose, and root runtime settings.
	@if [ "$${TASKFLOW_NVM_WRAPPED:-0}" = "1" ]; then \
		./scripts/devops/doctor.sh; \
	else \
		./scripts/devops/run-make.sh doctor; \
	fi

up: ## Start the full local runtime in the background.
	$(call announce,Starting TaskFlow,Compose will build changed images and start the local runtime in the background.)
	@$(COMPOSE) up --build -d
	@$(MAKE) urls

dev: ## Start the full local runtime in the foreground.
	$(call announce,Starting foreground runtime,Attached logs will stream until the process is stopped.)
	@$(MAKE) urls
	@$(COMPOSE) up --build

down: ## Stop the local runtime and remove orphan containers.
	$(call announce,Stopping TaskFlow,Compose services will stop and orphan containers will be removed.)
	@$(COMPOSE) down --remove-orphans

restart: ## Restart the full local runtime.
	$(call announce,Restarting TaskFlow,Stopping the current runtime before starting it again.)
	@$(MAKE) down
	@$(MAKE) up

ps: ## Show Compose service status.
	@$(COMPOSE) ps

logs: ## Tail logs from all Compose services.
	@$(COMPOSE) logs -f --tail=200

urls: ## Show the canonical local service URLs.
	@printf '\n$(BOLD)TaskFlow URLs$(RESET)\n\n'
	@printf '  $(TEAL)%-18s$(RESET) %s\n' 'Frontend' 'http://localhost:8000'
	@printf '  $(TEAL)%-18s$(RESET) %s\n' 'API root' 'http://api.localhost:8000'
	@printf '  $(TEAL)%-18s$(RESET) %s\n' 'GraphQL' 'http://api.localhost:8000/graphql'
	@printf '  $(TEAL)%-18s$(RESET) %s\n' 'Traefik dashboard' 'http://traefik.localhost:8080'
	@printf '  $(TEAL)%-18s$(RESET) %s\n' 'Postgres TCP' 'localhost:5433'
	@printf '  $(TEAL)%-18s$(RESET) %s\n\n' 'Redis TCP' 'localhost:6380'

health: ## Probe the running frontend and API health endpoints.
	$(call announce,Checking service health,This assumes the local runtime is already running.)
	@curl -fsS http://localhost:8000 >/dev/null && echo "frontend: ok" || (echo "frontend: unavailable" >&2 && exit 1)
	@curl -fsS http://api.localhost:8000/health >/dev/null && echo "api: ok" || (echo "api: unavailable" >&2 && exit 1)

shell-api: ## Open a shell inside the API container.
	@$(COMPOSE) exec api sh

shell-web: ## Open a shell inside the web container.
	@$(COMPOSE) exec web sh

shell-worker: ## Open a shell inside the worker container.
	@$(COMPOSE) exec worker sh

shell-postgres: ## Open psql inside the Postgres container.
	@$(COMPOSE) exec postgres psql -U postgres -d taskflow

shell-redis: ## Open the Redis CLI inside the Redis container.
	@$(COMPOSE) exec redis redis-cli

db-migrate: ## Run Alembic migrations inside the API container.
	$(call announce,Running database migrations,Alembic will execute against the local Compose database.)
	@$(COMPOSE) up -d postgres redis api
	@$(COMPOSE) exec -T api alembic upgrade head

db-revision: ## Create a new Alembic revision; pass NAME=my_change.
	@if [ -z "$(NAME)" ]; then \
		printf 'Usage: make db-revision NAME=add_tasks_index\n' >&2; \
		exit 2; \
	fi
	$(call announce,Creating database revision,Alembic will autogenerate a migration inside the API container.)
	@$(COMPOSE) up -d postgres redis api
	@$(COMPOSE) exec -T api alembic revision --autogenerate -m "$(NAME)"

db-downgrade: ## Roll back the latest Alembic revision.
	$(call announce,Rolling back database revision,Alembic will downgrade the local database by one revision.)
	@$(COMPOSE) up -d postgres redis api
	@$(COMPOSE) exec -T api alembic downgrade -1

graphql-schema: ## Refresh the checked-in GraphQL schema snapshot from the API source.
	$(call announce,Refreshing GraphQL schema snapshot,The API container will export the current Strawberry schema into packages/graphql/schema.graphql.)
	@$(COMPOSE) up -d postgres redis api
	@$(COMPOSE) run --rm api python -c 'from app.graphql.schema import schema; print(schema.as_str())' > packages/graphql/schema.graphql

python-runtime-ready: ## Build the API and worker images used by Python validation targets.
	@$(COMPOSE) build api worker

format: python-runtime-ready ## Format JS/TS sources and Python services.
	$(call announce,Formatting workspace,Prettier and Black will update the repository in place.)
	@pnpm format
	@$(COMPOSE) run --rm api sh -lc 'black .'
	@$(COMPOSE) run --rm worker sh -lc 'black .'

format-check: python-runtime-ready ## Check formatting for JS/TS sources and Python services.
	$(call announce,Checking formatting,No files will be modified.)
	@pnpm format:check
	@$(COMPOSE) run --rm api sh -lc 'black --check .'
	@$(COMPOSE) run --rm worker sh -lc 'black --check .'

check-types: ## Run workspace TypeScript checks.
	$(call announce,Checking TypeScript,Workspace TypeScript validation will run from the repo root.)
	@pnpm check-types

lint: python-runtime-ready ## Run JS/TS lint plus Python Ruff checks.
	$(call announce,Running lint,JS and Python lint checks will run against the repo contract.)
	@pnpm lint
	@$(COMPOSE) run --rm api sh -lc 'ruff check .'
	@$(COMPOSE) run --rm worker sh -lc 'ruff check .'

test: ## Run the current local test baseline.
	$(call announce,Running tests,Frontend, API, and worker tests will run in the current repo contract.)
	@$(MAKE) test-web
	@$(MAKE) test-backend
	@$(MAKE) test-worker

test-web: ## Run web and package Vitest suites once.
	@pnpm test:run

test-backend: python-runtime-ready ## Run API pytest when present, otherwise run the API smoke fallback.
	@$(COMPOSE) up -d postgres redis
	@if find "$(API_TEST_DIR)" -type f -name 'test_*.py' | grep -q .; then \
		$(COMPOSE) run --rm api pytest; \
	else \
		$(COMPOSE) run --rm api sh -lc 'python -m compileall app main.py && python -c "import main"'; \
	fi

test-worker: python-runtime-ready ## Run worker pytest when present, otherwise run the worker smoke fallback.
	@$(COMPOSE) up -d postgres redis
	@if find "$(WORKER_TEST_DIR)" -type f -name 'test_*.py' | grep -q .; then \
		$(COMPOSE) run --rm worker pytest; \
	else \
		$(COMPOSE) run --rm worker sh -lc 'python -m compileall config tasks main.py && python -c "import main"'; \
	fi

test-e2e: ## Run Playwright if an e2e suite exists.
	@if [ -d apps/web/e2e ] && find apps/web/e2e -type f | grep -q .; then \
		pnpm --filter $(WEB_PACKAGE) test:e2e; \
	else \
		printf 'No e2e suite exists under apps/web/e2e; skipping Playwright.\n'; \
	fi

build: ## Build JS workspaces and refresh local service images.
	$(call announce,Building workspace,Production builds and container builds will run from the canonical repo contract.)
	@pnpm build
	@$(COMPOSE) build api worker web

validate: ## Run the full local validation baseline.
	@$(MAKE) format-check
	@$(MAKE) check-types
	@$(MAKE) lint
	@$(MAKE) test
	@$(MAKE) build

release-check: ## Run the local release confidence baseline.
	$(call announce,Running release confidence checks,Validation plus diff hygiene will run before grouped commits or pushes.)
	@$(MAKE) validate
	@git diff --check

verify-commit: ## Verify the current HEAD signature.
	@git verify-commit HEAD

clean: ## Stop the runtime and clean JS build artifacts.
	$(call announce,Cleaning workspace,Compose services will stop and JS clean targets will run.)
	-@pnpm clean
	@$(COMPOSE) down --remove-orphans

clean-volumes: ## Remove local Compose volumes. Destructive.
	$(call announce,Removing local volumes,Compose data volumes will be deleted from the local machine.)
	@$(COMPOSE) down --volumes --remove-orphans
