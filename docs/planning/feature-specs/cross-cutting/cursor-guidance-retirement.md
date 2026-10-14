# Delivery: Cursor Guidance Retirement

## Status

- Type: `Workflow`
- Status: `Completed`

## Problem

The existing local changes remove Cursor rules, bundled skills, and Cursor ignore configuration. Current contributor docs and Codex agent prompts still reference the removed rule files.

## Operator Outcome

Contributors and Codex agents follow AGENTS.md and canonical docs without references to absent Cursor guidance.

## Scope

- deliver the existing .cursor and .cursorignore removals as a separate signed commit
- retain durable package, import, testing, and commit requirements in AGENTS.md
- update current workflow docs and Codex agent read paths
- preserve completed historical specs as records of their original delivery

## Non-Goals

- changing application behavior or custom-agent roles
- installing replacement skills or changing global configuration

## Boundaries

- .cursor, .cursorignore, AGENTS.md
- .codex/agents/taskflow-package-boundary-agent.toml
- .codex/agents/taskflow-release-manager.toml
- docs/development/workflow.md, docs/product/slices.md, planning context

## Affected Surfaces

- contributor guidance, Codex agent read paths, editor guidance

## Acceptance Checks

- current guidance has no required read paths into the deleted .cursor directory
- AGENTS.md retains the relevant package/import, test, and signed-release requirements
- all Codex TOML files parse and changed Markdown passes formatting checks
- grouped commits are signed and verified before pushing

## Validation Plan

- parse .codex TOML with Python tomllib
- search current governance surfaces for stale .cursor references
- run focused Markdown formatting and git diff --check
- reuse the runtime slice release-check for unchanged application surfaces

## Validation Outcome

- October 14, 2026: all 14 `.codex/**/*.toml` files parsed with Python `tomllib`.
- Current `AGENTS.md`, workflow docs, product slices, planning context, and Codex agent prompts have no required `.cursor` read paths.
- Changed Markdown Prettier checks and `git diff --check` passed.
- The combined working tree passed the canonical release-check; application changes are confined to the runtime and API compatibility slices.
