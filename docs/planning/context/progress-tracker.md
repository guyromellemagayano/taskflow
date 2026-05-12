# TaskFlow Progress Tracker

## Current Working Contract

- Canonical runtime: `bootstrap`, `doctor`, `up`, `dev`, `down`, `logs`, `urls`, `db-migrate`, `format-check`, `check-types`, `lint`, `test`, `build`, `validate`, `release-check`, `verify-commit`
- Canonical delivery flow: product slice -> phase -> feature spec -> active work -> bounded implementation -> validation -> grouped signed commit -> push
- Canonical repo governance: `AGENTS.md` plus `.cursor/rules/*`

## Current Next-Work Queue

- Make shared packages and GraphQL/codegen boundaries authoritative
- Align Alembic migrations and SQLAlchemy models
- Add a real `apps/web/e2e` suite instead of relying on a Playwright placeholder
- Deepen Python runtime quality checks once the baseline workflow is stable
