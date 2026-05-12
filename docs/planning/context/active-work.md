# TaskFlow Active Work

## Purpose

This file is the live execution control surface for current delivery work.

## Active Initiative

- Status: `In Progress`
- Current active feature spec: [`../feature-specs/cross-cutting/dependency-vulnerability-hardening.md`](../feature-specs/cross-cutting/dependency-vulnerability-hardening.md)
- Current slice: Contract truth hardening
- Current scope: reduce actionable default-branch dependency vulnerabilities, harden the live web attack surface, document blocked upstream advisory paths, and keep the canonical validation contract green

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

- Patched `next` releases recommended by `pnpm audit` were not installable from the registry view available during the current hardening pass
- Patched GraphQL codegen releases recommended by `pnpm audit` were not installable from the registry view available during the current hardening pass
