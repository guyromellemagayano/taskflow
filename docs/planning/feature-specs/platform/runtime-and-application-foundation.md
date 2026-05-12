# Runtime And Application Foundation

## Purpose

Establish the baseline runtime and application surfaces required for TaskFlow to run as a single product with a web app, API, and worker.

## Intended Outcome

- The repo can run a web app, API, Redis-backed auth support, database-backed task data, and a Celery worker under one local stack.
- The product exposes enough operational endpoints to validate availability and basic observability.
- The initial product shell is narrow but usable instead of pretending to be feature-complete.

## Delivered Scope

- Next.js app shell with a public home page that reports API connectivity.
- FastAPI entrypoint with root, API info, health, readiness, metrics, GraphQL, and REST auth surfaces.
- Celery worker entrypoint and beat schedule.
- Docker-backed local runtime wiring for the baseline services.

## Constraints Carried Forward

- The worker exists before analytics is fully implemented.
- The public home page is a runtime and connectivity surface rather than a polished product dashboard.
- Some API lifecycle behavior still needs follow-up hardening around lifespan and dependency warnings.

## Follow-On Work

- Keep operational endpoints and runtime validation aligned with the current local workflow contract.
- Use later slices to harden data contracts, browser validation, and async processing depth.
