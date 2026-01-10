<!-- markdownlint-disable MD024 -->

# TaskFlow

A modern full-stack task management application built with Next.js, FastAPI, and PostgreSQL.

## Architecture

TaskFlow is built as a Turborepo monorepo with the following structure:

- **Frontend** (`apps/web`): Next.js 14+ with React, TypeScript, Mantine UI, Apollo Client, and TanStack Query
- **Backend** (`apps/api`): FastAPI with Strawberry GraphQL, SQLAlchemy, and PostgreSQL
- **Worker** (`apps/worker`): Celery worker for background task processing
- **Shared** (`packages/shared`): Shared TypeScript types and utilities
- **GraphQL** (`packages/graphql`): GraphQL schema and code generation

## Implementation Status

### ✅ Phase 1: Project Setup & Infrastructure

Complete - Monorepo structure, Docker setup, database migrations, and all infrastructure components are in place.

### ✅ Phase 2: Authentication System

Complete - Full JWT authentication with refresh tokens, user registration/login, protected routes, and token management.

**Note:** Token storage currently uses localStorage. httpOnly cookies can be implemented as a future security enhancement.

### 🚧 Phase 3: Task Management (CRUD)

Next up - Task CRUD operations with filtering, sorting, and pagination.

### Infrastructure

- **Traefik**: Reverse proxy handling all routing (port 8000)
- **PostgreSQL**: Database (port 5433, configurable via `POSTGRES_PORT` env var)
- **Redis**: Cache and Celery broker (port 6380)

**All services run exclusively in Docker containers** - no local Python or Node.js runtime needed for production services.

## Tech Stack

### Frontend

- Next.js 14+ (App Router)
- React 19+ with TypeScript
- Mantine UI v7+
- Apollo Client for GraphQL
- TanStack Query for state management
- Vitest + Playwright for testing
- Vite for module bundling

### Backend

- FastAPI with Python 3.11, 3.12, or 3.13 (3.14+ not yet supported)
- Strawberry GraphQL
- SQLAlchemy 2.0 (async) with Alembic
- PostgreSQL 15+
- Redis for caching and Celery broker
- JWT authentication with refresh tokens

### Testing

- Vitest for frontend unit/component tests
- Playwright for E2E tests
- pytest + httpx for backend tests

## Prerequisites

- **Docker and Docker Compose** (required) - All services run exclusively in Docker containers
- **Node.js and npm** (optional) - Only needed for running npm scripts locally (linting, testing, etc.)
- **Note**: No local Python runtime needed! All Python services (API, Worker) run in Docker containers.

## Getting Started

### Quick Start (Recommended)

```bash
# Complete setup (installs dependencies, starts services, runs migrations)
make setup
```

This will:

- Install Node.js dependencies (for npm scripts like linting and testing)
- Build Docker images for all services
- Start all Docker services (Traefik, PostgreSQL, Redis, API, Worker, Web)
- Run database migrations
- Verify everything is working

### Manual Setup

#### 1. Clone the repository

```bash
git clone <repository-url>
cd taskflow
```

#### 2. Install dependencies

```bash
# Install all dependencies (npm + build Docker images)
make install
```

**Note**: All services run exclusively in Docker containers. The `make install` command will:

- Install Node.js dependencies (for npm scripts)
- Build Docker images for API, Worker, and Web services

#### 3. Start all services

```bash
# Using Makefile (recommended)
make up

# Or using docker-compose directly
docker-compose up -d
```

This will start all services:

- **Traefik** on port 8000 (reverse proxy)
- **PostgreSQL** on port 5433 (default, configurable via `POSTGRES_PORT` env var)
- **Redis** on port 6380
- **API** (FastAPI) - accessible via Traefik
- **Worker** (Celery) - background processing
- **Web** (Next.js) - accessible via Traefik

**Note**: If port 8000 is already in use, you can change it in `docker-compose.yml` by modifying the Traefik port mapping.

#### 4. Run database migrations

```bash
# Migrations run inside Docker container
make migrate
```

**Note**: All Python commands (migrations, tests, etc.) run inside Docker containers.

### 5. Access the application

After running `make up`, all services are accessible through Traefik:

- **Frontend**: <http://localhost:8000>
- **API**: <http://api.localhost:8000> or <http://localhost:8000/api>
- **Traefik Dashboard**: <http://traefik.localhost:8080>

## Project Structure

```text
taskflow/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── worker/       # Celery worker
├── packages/
│   ├── shared/       # Shared TypeScript types
│   ├── graphql/      # GraphQL codegen config
│   └── ui/           # Shared UI components (future)
├── docker-compose.yml
├── Makefile          # Development commands
├── taskflow.code-workspace  # VS Code/Cursor workspace file
├── turbo.json        # Turborepo configuration
└── package.json      # Root package.json
```

## Available Commands

### Using Makefile (Recommended)

Run `make help` to see all available commands. Common commands:

**Docker Services:**

- `make up` - Start all Docker services (Traefik, PostgreSQL, Redis, API, Worker, Web)
- `make down` - Stop all Docker services
- `make restart` - Restart all services
- `make ps` - Show service status
- `make logs` - View all logs
- `make logs-web` - View frontend logs
- `make logs-api` - View API logs
- `make logs-worker` - View worker logs
- `make logs-traefik` - View Traefik logs
- `make logs-postgres` - View PostgreSQL logs
- `make logs-redis` - View Redis logs
- `make health` - Check service health
- `make shell-postgres` - Open PostgreSQL shell
- `make shell-redis` - Open Redis CLI
- `make clean` - Stop and remove containers
- `make clean-volumes` - Remove all volumes (WARNING: deletes data)

**Development:**

- `make dev-frontend` - Start frontend development server
- `make dev-backend` - Start backend development server
- `make dev-worker` - Start Celery worker
- `make dev-db` - Start only database services (PostgreSQL, Redis)

**Database:**

- `make migrate` - Run database migrations
- `make migrate-create NAME=name` - Create new migration
- `make migrate-downgrade` - Rollback last migration

**Testing:**

- `make test` - Run all tests
- `make test-frontend` - Run frontend tests
- `make test-backend` - Run backend tests
- `make test-e2e` - Run E2E tests
- `make test-coverage` - Run tests with coverage

**Code Quality:**

- `make lint` - Lint all code
- `make format` - Format all code
- `make type-check` - Run TypeScript checks

**Setup:**

- `make setup` - Complete project setup
- `make install` - Install all dependencies
- `make check` - Check prerequisites

### Using npm/pip directly

**Root level:**

- `npm run build` - Build all apps (via Turborepo)
- `npm run test` - Run all tests (via Turborepo)
- `npm run lint` - Lint all apps (via Turborepo)
- `npm run type-check` - Type check all apps

**Note**: All services run in Docker containers. Use `make up` to start all services.

**Frontend (`apps/web`):**

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run test` - Run Vitest tests
- `npm run test:e2e` - Run Playwright E2E tests

**Backend (`apps/api`):**

All backend commands run inside Docker containers:

- `make migrate` - Run database migrations (in Docker)
- `make test-backend` - Run tests (in Docker)
- `make logs-api` - View API logs

## Development

This project uses:

- **Turborepo** for monorepo management
- **Docker & Docker Compose** for containerization
- **Traefik** for reverse proxy and routing
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **Black** and **Ruff** for Python code formatting

## Access Points

After starting services with `make up`:

- **Frontend**: <http://localhost:8000>
- **API**: <http://api.localhost:8000> or <http://localhost:8000/api>
- **Traefik Dashboard**: <http://traefik.localhost:8080>

All services are accessible through Traefik on port 8000. The reverse proxy automatically routes requests to the appropriate service.

## Environment Variables

Environment variables can be configured via `.env` files or Docker Compose environment variables:

### API Service

- `DATABASE_URL` - PostgreSQL connection string (default: configured for Docker)
- `REDIS_URL` - Redis connection string (default: configured for Docker)
- `JWT_SECRET_KEY` - JWT secret key (default: change in production!)
- `JWT_ALGORITHM` - JWT algorithm (default: HS256)
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` - Access token expiry (default: 15)
- `JWT_REFRESH_TOKEN_EXPIRE_DAYS` - Refresh token expiry (default: 7)
- `CORS_ORIGINS` - Allowed CORS origins (default: configured for Traefik)
- `ENVIRONMENT` - Environment name (default: development)
- `DEBUG` - Debug mode (default: true)

### Worker Service

- `REDIS_URL` - Redis connection for Celery broker
- `DATABASE_URL` - Database connection for tasks

### Web Service

- `NODE_ENV` - Node environment (default: production)
- `NEXT_PUBLIC_API_URL` - API URL for frontend (default: <http://api.localhost>)

**Note**: Most environment variables have sensible defaults for Docker development. Create `.env` files in `apps/api/` or `apps/worker/` to override defaults.

## Troubleshooting

### Port Conflicts

**Port 8000 (Traefik) already in use:**

1. Check what's using the port: `lsof -i :8000`
2. Either stop the conflicting service or change Traefik port in `docker-compose.yml`
3. Update access URLs accordingly

**Port 5432 (PostgreSQL) already in use:**

- The Docker PostgreSQL uses port 5433 by default (configurable via `POSTGRES_PORT` environment variable).
- The default `DATABASE_URL` is configured for port 5433.
- To use a different port, set the `POSTGRES_PORT` environment variable: `export POSTGRES_PORT=5434`

### Services Won't Start

1. **Check Docker is running**: `docker ps`
2. **Check service status**: `make ps`
3. **View logs**: `make logs` or `make logs-<service>`
4. **Check health**: `make health`
5. **Rebuild images**: `docker-compose build --no-cache`

### Database Connection Issues

1. **Verify PostgreSQL is healthy**: `make health`
2. **Check PostgreSQL logs**: `make logs-postgres`
3. **Test connection**: `make shell-postgres`
4. **Port conflict**: If you see "role 'postgres' does not exist", verify the `DATABASE_URL` in your config matches the Docker PostgreSQL port (5433 by default).

### Frontend Not Loading

1. **Check Web container logs**: `make logs-web`
2. **Verify Traefik routing**: Visit `http://traefik.localhost:8080`
3. **Check if Web service is running**: `make ps`

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose build api
docker-compose build web
docker-compose build worker

# Rebuild all services
docker-compose build

# Rebuild and restart
docker-compose up -d --build
```

### Clean Start

```bash
# Stop and remove containers
make clean

# Remove volumes (WARNING: deletes all data)
make clean-volumes

# Fresh start
make setup
```

## LICENSE

Apache 2.0
