# TaskFlow Active Work

## Purpose

This file is the live execution control surface for current delivery work.

## Active Initiative

- Status: `Completed`
- Current active feature spec: [`../feature-specs/cross-cutting/alembic-and-model-alignment.md`](../feature-specs/cross-cutting/alembic-and-model-alignment.md)
- Current slice: Contract truth hardening
- Current scope: the Alembic history now upgrades existing databases onto the ORM's snake_case database contract and passes `alembic check` on a temporary verification database

## Most Recently Completed Initiative

- Initiative: Alembic and model alignment
- Feature spec: [`../feature-specs/cross-cutting/alembic-and-model-alignment.md`](../feature-specs/cross-cutting/alembic-and-model-alignment.md)
- Outcome: the migration history now aligns with SQLAlchemy metadata for snake_case task and user columns, and the repo validation contract remains green

## Next Approved Candidate Specs

- Task quality and browser coverage hardening
- Package and contract truth hardening beyond dependency alerts
- Runtime warning cleanup for FastAPI lifespan and Python dependency deprecations

## Latest Validation

- Completed locally on May 12, 2026 through `./scripts/devops/run-make.sh validate`

## Blockers

- None. The corrective migration validates on a temporary database and the canonical repo contract passes locally.
