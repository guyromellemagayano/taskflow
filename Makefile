.PHONY: help install up down restart logs logs-api logs-worker logs-web logs-traefik logs-postgres logs-redis ps shell-postgres shell-redis clean clean-volumes health check migrate migrate-create migrate-downgrade test test-frontend test-backend test-e2e test-coverage test-frontend-coverage test-backend-coverage dev-frontend dev-backend dev-worker dev-db build build-frontend lint format type-check setup

.DEFAULT_GOAL := help

BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

help: ## Display this help message
	@echo "$(BLUE)TaskFlow - Available Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)📦 INSTALLATION$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^(install|setup).*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)🐳 DOCKER SERVICES$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^(up|down|restart|logs|ps|shell-postgres|shell-redis|health|clean):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)🔧 DEVELOPMENT$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^dev-.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)🗄️  DATABASE$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^migrate.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)🧪 TESTING$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^test.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)🔨 BUILD & QUALITY$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^(build|lint|format|type-check).*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)ℹ️  UTILITIES$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^(check|clean).*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""

## INSTALLATION

install: ## Install all dependencies (npm + build Docker images)
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@echo "$(YELLOW)Installing Node.js dependencies...$(NC)"
	@npm install || (echo "$(RED)✗ Failed to install Node.js dependencies$(NC)" && exit 1)
	@echo "$(YELLOW)Building Docker images for all services...$(NC)"
	@docker-compose build api worker web || (echo "$(RED)✗ Failed to build Docker images$(NC)" && exit 1)
	@echo "$(GREEN)✓ All dependencies installed$(NC)"
	@echo "$(YELLOW)All services run in Docker containers$(NC)"

## DOCKER COMMANDS

up: ## Start all Docker services (Traefik, PostgreSQL, Redis, API, Worker, Web)
	@echo "$(BLUE)Starting all Docker services...$(NC)"
	@docker-compose up -d --build
	@echo "$(GREEN)✓ All services started$(NC)"
	@echo ""
	@echo "$(YELLOW)Access points:$(NC)"
	@echo "  - Frontend: $(GREEN)http://localhost:8000$(NC)"
	@echo "  - API: $(GREEN)http://api.localhost:8000$(NC) or $(GREEN)http://localhost:8000/api$(NC)"
	@echo "  - Traefik Dashboard: $(GREEN)http://traefik.localhost:8080$(NC)"
	@echo ""
	@make ps

down: ## Stop all Docker services
	@echo "$(BLUE)Stopping all Docker services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ All services stopped$(NC)"

restart: ## Restart all Docker services
	@echo "$(BLUE)Restarting Docker services...$(NC)"
	@docker-compose restart
	@make ps

logs: ## View logs from all services
	@docker-compose logs -f

logs-api: ## View API logs
	@docker-compose logs -f api

logs-worker: ## View Worker logs
	@docker-compose logs -f worker

logs-web: ## View Web logs
	@docker-compose logs -f web

logs-traefik: ## View Traefik logs
	@docker-compose logs -f traefik

logs-postgres: ## View PostgreSQL logs
	@docker-compose logs -f postgres

logs-redis: ## View Redis logs
	@docker-compose logs -f redis

ps: ## Show status of all Docker services
	@echo "$(BLUE)Docker services status:$(NC)"
	@docker-compose ps

shell-postgres: ## Open PostgreSQL shell
	@echo "$(BLUE)Connecting to PostgreSQL...$(NC)"
	@docker-compose exec postgres psql -U postgres -d taskflow

shell-redis: ## Open Redis CLI
	@echo "$(BLUE)Connecting to Redis...$(NC)"
	@docker-compose exec redis redis-cli

health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo ""
	@echo "$(YELLOW)Traefik:$(NC)"
	@docker-compose exec -T traefik sh -c "wget -q -O- http://localhost:8080/api/overview >/dev/null 2>&1 || curl -s http://localhost:8080/api/overview >/dev/null 2>&1" && echo "$(GREEN)✓ Traefik is ready$(NC)" || echo "$(RED)✗ Traefik not ready$(NC)"
	@echo ""
	@echo "$(YELLOW)PostgreSQL:$(NC)"
	@docker-compose exec -T postgres pg_isready -U postgres 2>/dev/null >/dev/null && echo "$(GREEN)✓ PostgreSQL is ready$(NC)" || echo "$(RED)✗ PostgreSQL not ready$(NC)"
	@echo ""
	@echo "$(YELLOW)Redis:$(NC)"
	@docker-compose exec -T redis redis-cli ping 2>/dev/null | grep -q PONG && echo "$(GREEN)✓ Redis is ready$(NC)" || echo "$(RED)✗ Redis not ready$(NC)"
	@echo ""
	@echo "$(YELLOW)API:$(NC)"
	@docker-compose exec -T api python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health').read()" 2>/dev/null >/dev/null && echo "$(GREEN)✓ API is ready$(NC)" || echo "$(RED)✗ API not ready$(NC)"
	@echo ""
	@echo "$(YELLOW)Worker:$(NC)"
	@docker-compose exec -T worker celery -A main inspect ping 2>/dev/null | grep -q pong && echo "$(GREEN)✓ Worker is ready$(NC)" || echo "$(RED)✗ Worker not ready$(NC)"
	@echo ""
	@echo "$(YELLOW)Web:$(NC)"
	@docker-compose exec -T web node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" 2>/dev/null >/dev/null && echo "$(GREEN)✓ Web is ready$(NC)" || echo "$(RED)✗ Web not ready$(NC)"

clean: ## Stop services and remove containers
	@echo "$(BLUE)Cleaning up Docker containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Containers removed$(NC)"

clean-volumes: ## Remove all volumes (WARNING: deletes all data)
	@echo "$(RED)WARNING: This will delete all database data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "$(GREEN)✓ Volumes removed$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

## DATABASE COMMANDS

migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	@docker-compose exec -T api alembic upgrade head || (echo "$(RED)✗ Migration failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Migrations complete$(NC)"

migrate-create: ## Create a new migration (usage: make migrate-create NAME=migration_name)
	@if [ -z "$(NAME)" ]; then \
		echo "$(RED)Error: NAME is required$(NC)"; \
		echo "Usage: make migrate-create NAME=add_user_table"; \
		exit 1; \
	fi
	@echo "$(BLUE)Creating migration: $(NAME)$(NC)"
	@docker-compose exec -T api alembic revision --autogenerate -m "$(NAME)" || (echo "$(RED)✗ Failed to create migration$(NC)" && exit 1)
	@echo "$(GREEN)✓ Migration created$(NC)"

migrate-downgrade: ## Rollback last migration
	@echo "$(BLUE)Rolling back last migration...$(NC)"
	@docker-compose exec -T api alembic downgrade -1 || (echo "$(RED)✗ Failed to rollback migration$(NC)" && exit 1)
	@echo "$(GREEN)✓ Migration rolled back$(NC)"

## DEVELOPMENT COMMANDS

dev-frontend: ## Start frontend development server
	@echo "$(BLUE)Starting frontend dev server...$(NC)"
	@docker-compose up -d web
	@echo "$(GREEN)✓ Frontend running at http://localhost:8000$(NC)"
	@echo "$(YELLOW)View logs: make logs-web$(NC)"

dev-backend: ## Start backend development server
	@echo "$(BLUE)Starting backend dev server...$(NC)"
	@docker-compose up -d api
	@echo "$(GREEN)✓ Backend API running at http://localhost:8000$(NC)"
	@echo "$(YELLOW)View logs: make logs-api$(NC)"

dev-worker: ## Start Celery worker
	@echo "$(BLUE)Starting Celery worker...$(NC)"
	@docker-compose up -d worker
	@echo "$(GREEN)✓ Celery worker running$(NC)"
	@echo "$(YELLOW)View logs: make logs-worker$(NC)"

dev-db: ## Start only database services (PostgreSQL, Redis)
	@echo "$(BLUE)Starting database services...$(NC)"
	@docker-compose up -d postgres redis
	@echo "$(GREEN)✓ Database services running$(NC)"

## TESTING COMMANDS

test: ## Run all tests
	@echo "$(BLUE)Running all tests...$(NC)"
	@make test-frontend
	@make test-backend

test-frontend: ## Run frontend tests (Vitest)
	@echo "$(BLUE)Running frontend tests...$(NC)"
	@if [ ! -d "apps/web" ]; then \
		echo "$(RED)Error: Frontend directory not found$(NC)"; \
		exit 1; \
	fi
	cd apps/web && npm run test

test-backend: ## Run backend tests (pytest in Docker)
	@echo "$(BLUE)Running backend tests...$(NC)"
	@docker-compose exec -T api pytest || (echo "$(RED)✗ Tests failed$(NC)" && exit 1)

test-e2e: ## Run E2E tests (Playwright)
	@echo "$(BLUE)Running E2E tests...$(NC)"
	@if [ ! -d "apps/web" ]; then \
		echo "$(RED)Error: Frontend directory not found$(NC)"; \
		exit 1; \
	fi
	cd apps/web && npm run test:e2e

test-coverage: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	@make test-frontend-coverage
	@make test-backend-coverage

test-frontend-coverage: ## Run frontend tests with coverage
	@echo "$(BLUE)Running frontend tests with coverage...$(NC)"
	@if [ ! -d "apps/web" ]; then \
		echo "$(RED)Error: Frontend directory not found$(NC)"; \
		exit 1; \
	fi
	cd apps/web && npm run test:coverage

test-backend-coverage: ## Run backend tests with coverage
	@echo "$(BLUE)Running backend tests with coverage...$(NC)"
	@docker-compose exec -T api pytest --cov=app --cov-report=html --cov-report=term || (echo "$(RED)✗ Tests failed$(NC)" && exit 1)

## BUILD COMMANDS

build: ## Build all applications (npm + Docker images)
	@echo "$(BLUE)Building all applications...$(NC)"
	@npm run build || echo "$(YELLOW)⚠ npm build failed or not configured$(NC)"
	@echo "$(YELLOW)Building Docker images...$(NC)"
	@docker-compose build api worker web || (echo "$(RED)✗ Failed to build Docker images$(NC)" && exit 1)
	@echo "$(GREEN)✓ Build complete$(NC)"

build-frontend: ## Build frontend only
	@echo "$(BLUE)Building frontend...$(NC)"
	@if [ ! -d "apps/web" ]; then \
		echo "$(RED)Error: Frontend directory not found$(NC)"; \
		exit 1; \
	fi
	cd apps/web && npm run build

## CODE QUALITY COMMANDS

lint: ## Lint all code
	@echo "$(BLUE)Linting code...$(NC)"
	@npm run lint || echo "$(YELLOW)⚠ Frontend linting failed or not configured$(NC)"
	@echo "$(YELLOW)Linting Python code...$(NC)"
	@docker-compose exec -T api ruff check . && docker-compose exec -T api mypy app || echo "$(YELLOW)⚠ Python linting issues found$(NC)"

format: ## Format all code
	@echo "$(BLUE)Formatting code...$(NC)"
	@npm run format 2>/dev/null || npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}" || echo "$(YELLOW)⚠ Frontend formatting failed or not configured$(NC)"
	@echo "$(YELLOW)Formatting Python code...$(NC)"
	@docker-compose exec -T api black . && docker-compose exec -T api ruff format . || echo "$(YELLOW)⚠ Python formatting failed$(NC)"

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Running type checks...$(NC)"
	@npm run type-check || (echo "$(RED)✗ Type check failed$(NC)" && exit 1)

## SETUP COMMANDS

setup: ## Complete project setup (install deps, start services, run migrations)
	@echo "$(BLUE)Setting up TaskFlow project...$(NC)"
	@make install
	@make up
	@echo "$(YELLOW)Waiting for services to be ready...$(NC)"
	@sleep 15
	@make health
	@make migrate
	@echo ""
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo ""
	@echo "$(BLUE)Access points:$(NC)"
	@echo "  - Frontend: $(GREEN)http://localhost:8000$(NC)"
	@echo "  - API: $(GREEN)http://api.localhost:8000$(NC) or $(GREEN)http://localhost:8000/api$(NC)"
	@echo "  - Traefik Dashboard: $(GREEN)http://traefik.localhost:8080$(NC)"
	@echo ""
	@echo "$(BLUE)View logs:$(NC)"
	@echo "  - Web: $(GREEN)make logs-web$(NC)"
	@echo "  - API: $(GREEN)make logs-api$(NC)"
	@echo "  - Worker: $(GREEN)make logs-worker$(NC)"
	@echo "  - Traefik: $(GREEN)make logs-traefik$(NC)"

check: ## Check if all prerequisites are met
	@echo "$(BLUE)Checking prerequisites...$(NC)"
	@command -v docker >/dev/null 2>&1 && echo "$(GREEN)✓ Docker installed$(NC)" || echo "$(RED)✗ Docker not found$(NC)"
	@command -v docker-compose >/dev/null 2>&1 && echo "$(GREEN)✓ Docker Compose installed$(NC)" || echo "$(RED)✗ Docker Compose not found$(NC)"
	@docker info >/dev/null 2>&1 && echo "$(GREEN)✓ Docker daemon running$(NC)" || echo "$(RED)✗ Docker daemon not running$(NC)"
	@command -v node >/dev/null 2>&1 && echo "$(GREEN)✓ Node.js installed (optional, for npm scripts)$(NC)" || echo "$(YELLOW)⚠ Node.js not found (optional)$(NC)"
	@command -v npm >/dev/null 2>&1 && echo "$(GREEN)✓ npm installed (optional, for npm scripts)$(NC)" || echo "$(YELLOW)⚠ npm not found (optional)$(NC)"
