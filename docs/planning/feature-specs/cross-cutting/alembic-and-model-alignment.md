# Delivery: Alembic And Model Alignment

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

TaskFlow's SQLAlchemy models map snake_case database column names, but the initial Alembic revision still creates camelCase task and user columns plus mismatched simple-index names. That leaves the live migration history out of contract with the ORM metadata and risks schema drift for any database built from migrations alone.

## Operator Outcome

Contributors should be able to migrate an empty or existing database to `head` and get the same column and index contract that the ORM metadata expects, without changing GraphQL field names or rebuilding the product schema from scratch.

## Scope

- add a corrective Alembic revision that renames the mismatched columns and simple indexes into the ORM's snake_case contract
- preserve existing data while upgrading databases already created from `001_initial`
- validate the upgraded schema against SQLAlchemy metadata on a temporary database

## Non-Goals

- changing GraphQL field names, model attribute names, or API payload shape
- redesigning the task or user schema beyond the column-name alignment work
- rewriting `001_initial` in place and assuming every existing database can be recreated

## Boundaries

- `apps/api/alembic/versions/*`
- `apps/api/app/models/*` only if the ORM contract itself is inconsistent
- planning context and status docs touched by this hardening slice

## Acceptance Checks

- a temporary database can run `alembic upgrade head` successfully
- the upgraded temporary database passes `alembic check` with no pending operations
- the canonical repo validation contract still passes after the migration change

## Validation Plan

- create a temporary Postgres database under the local Compose postgres service
- run `alembic upgrade head` against that temporary database
- run `alembic check` against the same temporary database
- run `./scripts/devops/run-make.sh validate`
