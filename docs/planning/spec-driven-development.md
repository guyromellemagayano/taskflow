# Spec-Driven Development

TaskFlow now uses a docs-first delivery workflow for non-trivial work.

## Execution Chain

1. Define or update the intended product surface in [Product Features](../product/features.md).
2. Record the module status in [Module Feature Checklist](../product/module-feature-checklist.md).
3. Define the product slice in [Product Slices](../product/slices.md).
4. Place the work in the correct phase in [Phase Plan](./phase-plan.md).
5. Write or update the feature spec for the slice.
6. Mark the slice in [Active Work](./context/active-work.md).
7. Implement in bounded file or folder groups.
8. Validate narrowly first, then broaden when shared surfaces are touched.
9. Create a grouped signed commit.
10. Verify the commit locally before pushing.

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
