# Delivery: GraphQL Core Compatibility Constraint

## Status

- Type: `Runtime`
- Status: `Completed`

## Problem

A fresh API image resolves graphql-core 3.3.0 through Strawberry 0.315.3's broad transitive range. Strawberry imports ExecutionContext, which graphql-core 3.3 removed, so API startup and pytest collection fail.

## Operator Outcome

Fresh API images resolve the compatible graphql-core 3.2 line and the current API test baseline runs successfully.

## Scope

- constrain graphql-core below 3.3 in API runtime requirements
- validate the rebuilt API and full release baseline

## Non-Goals

- upgrading Strawberry or implementing graphql-core 3.3 support
- addressing the wider dependency audit findings

## Boundaries

- apps/api/requirements.txt
- dependency-security docs and planning context

## Affected Surfaces

- API dependency resolution, Strawberry imports, API tests and image builds

## Acceptance Checks

- fresh API images resolve graphql-core 3.2.x
- API import and existing pytest suites pass
- canonical release-check passes after rebuilding

## Validation Plan

- reproduce the import failure during release-check
- run ./scripts/devops/run-make.sh test-backend after the constraint
- rerun ./scripts/devops/run-make.sh release-check

## References

- [GraphQL-core 3.3 release notes](https://github.com/graphql-python/graphql-core/releases/tag/v3.3.0)

## Validation Outcome

- Initial release-check failed at API pytest collection with an ExecutionContext import error under graphql-core 3.3.0.
- `./scripts/devops/run-make.sh test-backend`: all 7 API tests passed after resolving graphql-core 3.2.13.
- Full `./scripts/devops/run-make.sh release-check` passed on the combined runtime-alignment and compatibility-fix working tree, including all 36 tests and service image builds.
