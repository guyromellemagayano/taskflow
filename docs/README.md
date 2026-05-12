# TaskFlow Docs

These docs are the canonical operating contract for TaskFlow after the monorepo overhaul.

## Read Order

For non-trivial work, read in this order:

1. [Product Slices](./product/slices.md)
2. [Phase Plan](./planning/phase-plan.md)
3. The relevant architecture or development doc
4. [Spec-Driven Development](./planning/spec-driven-development.md)
5. The relevant planning context files
6. The active or proposed feature spec
7. [Active Work](./planning/context/active-work.md)

## Docs Map

- [Product Slices](./product/slices.md): the release slices that define what TaskFlow is trying to land next
- [Phase Plan](./planning/phase-plan.md): the ordered implementation phases and their current status
- [Planning Context](./planning/context/): active slice tracking and shipped posture
- [Feature Specs](./planning/feature-specs/): non-trivial delivery specs
- [Runtime Architecture](./architecture/runtime.md): local runtime, tooling, and validation contract
- [Frontend Architecture](./architecture/frontend.md): web-app and shared-package boundaries
- [Backend Architecture](./architecture/backend.md): API, worker, and Python dependency rules
- [Development Workflow](./development/workflow.md): day-to-day slice, validation, commit, and push workflow
