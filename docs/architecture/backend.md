# Backend Architecture

## Primary Surfaces

- `apps/api` owns FastAPI, Strawberry GraphQL, SQLAlchemy, and Alembic behavior.
- `apps/worker` owns Celery and background execution behavior.

## Dependency Contract

- `requirements.txt` and `requirements-dev.txt` are the Python dependency source of truth.
- `pyproject.toml` files define formatter, linter, type-checker, and pytest behavior only.

## Service Boundaries

- API and worker remain separate runtimes even when they share infrastructure.
- Database migrations and ORM models must stay aligned.
- Runtime hardening work should land as its own slice when migrations, models, GraphQL schema, or worker contracts change together.

## Validation Rules

- API behavior uses pytest in `apps/api/tests`.
- Worker behavior uses pytest in `apps/worker/tests`.
- If a full test suite does not exist yet, keep at least a narrow smoke path in the canonical validation flow.
