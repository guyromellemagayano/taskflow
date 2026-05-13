# Delivery: Runtime Warning Cleanup

## Status

- Type: `Hardening`
- Status: `Completed`

## Problem

TaskFlow validation still emitted backend runtime warnings tied to deprecated FastAPI startup/shutdown hooks and the `passlib` hashing stack. The application behavior worked, but validation output still signaled contract drift.

## Operator Outcome

Contributors should be able to run API validation without the previous lifespan and password-hashing deprecation warnings.

## Scope

- replace deprecated FastAPI `on_event` startup/shutdown hooks with lifespan handling
- replace `passlib` password hashing helpers with a direct Argon2 service contract
- keep auth flow behavior stable for register/login/refresh/logout surfaces
- add focused API tests for password hashing and verification behavior

## Non-Goals

- changing auth transport behavior between GraphQL token persistence and REST cookie endpoints
- redesigning auth models, JWT format, or cookie policy
- introducing new user-facing auth flows

## Boundaries

- `apps/api/main.py`
- `apps/api/app/services/user_service.py`
- `apps/api/requirements.txt`
- `apps/api/tests/test_password_hashing.py`
- planning and progress docs touched by this slice

## Acceptance Checks

- FastAPI startup/shutdown lifecycle is implemented through lifespan rather than `on_event`
- API password hashing and verification run on Argon2 without the prior passlib runtime warning path
- API password hashing behavior is covered by focused tests
- `./scripts/devops/run-make.sh test-backend`
- `./scripts/devops/run-make.sh validate`

## Validation Plan

- migrate app lifecycle wiring to lifespan
- migrate hashing helpers to Argon2 and keep auth service call sites stable
- add tests for hash prefix, valid verification, invalid password, and invalid hash handling
- run targeted backend tests, then full repo validation

## Validation Outcome

- `./scripts/devops/run-make.sh test-backend`
- `./scripts/devops/run-make.sh validate`
