# Spec-Driven Development

TaskFlow now uses a docs-first delivery workflow for non-trivial work.

## Execution Chain

1. Define the product slice in [Product Slices](../product/slices.md).
2. Place the work in the correct phase in [Phase Plan](./phase-plan.md).
3. Write or update the feature spec for the slice.
4. Mark the slice in [Active Work](./context/active-work.md).
5. Implement in bounded file or folder groups.
6. Validate narrowly first, then broaden when shared surfaces are touched.
7. Create a grouped signed commit.
8. Verify the commit locally before pushing.

## What Requires A Feature Spec

Use a feature spec for:

- new features
- workflow or tooling changes
- schema or migration changes
- cross-package refactors
- cross-runtime changes
- release-process changes

Trivial typo-only or formatting-only changes can skip a feature spec if they do not change durable behavior or repo workflow.

## Grouped Delivery Rule

- Group changes by slice or responsibility first.
- Use subphases only when they correspond to real boundaries such as runtime, schema, web, API, worker, CI, or release controls.
- Do not let folder structure invent fake delivery phases.
