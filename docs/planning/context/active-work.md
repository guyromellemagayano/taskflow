# TaskFlow Active Work

## Purpose

This file is the live execution control surface for current delivery work.

## Active Initiative

- Status: `In Progress`
- Current active feature spec: [`../feature-specs/cross-cutting/dependency-vulnerability-hardening.md`](../feature-specs/cross-cutting/dependency-vulnerability-hardening.md)
- Current slice: Contract truth hardening
- Current scope: finish the remaining GraphQL codegen dependency advisories after the patched Next.js line and web runtime surface were already hardened under the current contract

## Most Recently Completed Initiative

- Initiative: Product docs backfill and status normalization
- Feature spec: [`../feature-specs/cross-cutting/product-docs-backfill.md`](../feature-specs/cross-cutting/product-docs-backfill.md)
- Outcome: the product, planning, and historical foundation docs were backfilled from live repo truth and became the default planning baseline

## Next Approved Candidate Specs

- Migration and model alignment
- Task quality and browser coverage hardening
- Package and contract truth hardening beyond dependency alerts

## Latest Validation

- Completed locally on May 12, 2026 through `./scripts/devops/run-make.sh validate`

## Blockers

- Patched GraphQL codegen releases recommended by `pnpm audit` were not installable from the default package-manager resolution path and still need a reliable install path before the last npm advisories can be cleared
