# TaskFlow Docs

These docs are the canonical operating contract for TaskFlow after the monorepo overhaul.

## Read Order

For non-trivial work, read in this order:

1. [Product Features](./product/features.md)
2. [Module Feature Checklist](./product/module-feature-checklist.md)
3. [Product Slices](./product/slices.md)
4. [Phase Plan](./planning/phase-plan.md)
5. The relevant architecture or development doc
6. [Spec-Driven Development](./planning/spec-driven-development.md)
7. The active or proposed feature spec
8. [Active Work](./planning/context/active-work.md)

## Docs Map

- [Product Features](./product/features.md): the canonical product surface that active slices must support
- [Module Feature Checklist](./product/module-feature-checklist.md): shipped, partial, planned, and hardening status by module
- [Product Slices](./product/slices.md): the release slices that define how TaskFlow is sequenced and what it is landing next
- [Phase Plan](./planning/phase-plan.md): the ordered implementation phases and their current status
- [Planning Context](./planning/context/): active slice tracking and shipped posture
- [Feature Specs](./planning/feature-specs/): non-trivial delivery specs
- [Runtime Architecture](./architecture/runtime.md): local runtime, tooling, and validation contract
- [Frontend Architecture](./architecture/frontend.md): web-app and shared-package boundaries
- [Backend Architecture](./architecture/backend.md): API, worker, and Python dependency rules
- [Development Workflow](./development/workflow.md): day-to-day slice, validation, commit, and push workflow
