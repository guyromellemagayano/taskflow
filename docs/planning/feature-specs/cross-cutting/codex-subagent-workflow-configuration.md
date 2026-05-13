# Delivery: Codex Subagent Workflow Configuration

## Status

- Type: `Workflow`
- Status: `Completed`

## Problem

TaskFlow has a docs-first polyglot monorepo workflow, but Codex had no repo-scoped custom subagent configuration for delegating bounded work across planning, web, API, worker, package, dependency, runtime, and release surfaces.

Without explicit subagent files, parallel Codex work would depend on ad hoc prompts and would be more likely to cross package boundaries, skip the feature-spec gate, or mix unrelated implementation and release responsibilities.

## Operator Outcome

Contributors can explicitly delegate TaskFlow work to narrow Codex subagents with clear ownership, model defaults, sandbox posture, and repo-specific guardrails.

## Scope

- add repo-scoped Codex agent fan-out limits
- add one `.codex/agents/*.toml` file per approved TaskFlow subagent
- document when and how the subagents fit into the development workflow
- keep active planning context aligned with the new workflow configuration

## Non-Goals

- replacing `AGENTS.md` or `.cursor/rules/*` as the instruction authority
- creating repo skills under `.agents/skills`
- changing Make, CI, package, API, web, worker, or runtime behavior
- auto-spawning subagents without an explicit user request

## Boundaries

- `.codex/config.toml`
- `.codex/agents/*.toml`
- `docs/development/workflow.md`
- `docs/planning/context/active-work.md`
- `docs/planning/context/progress-tracker.md`

## Affected Surfaces

- Codex CLI and IDE custom-agent discovery for this repository
- docs-first planning and release workflow guidance
- delegated exploration, implementation, validation, and release-hygiene prompts

## Acceptance Checks

- `.codex/config.toml` defines bounded subagent fan-out
- `.codex/agents` contains the approved TaskFlow subagent roster
- every subagent has a narrow role, model, reasoning effort, sandbox mode, and developer instructions
- read-heavy explorer roles use read-only sandboxing
- implementation and release roles preserve TaskFlow docs, package, validation, and signed-commit rules
- workflow docs explain that subagents are explicit delegation tools, not automatic planning bypasses

## Validation Plan

- parse all `.codex/**/*.toml` files with Python `tomllib`
- run `git diff --check`
- review the resulting diff for scope and docs/config alignment

## Validation Outcome

- `python3 -c 'import pathlib, tomllib; paths=sorted(pathlib.Path(".codex").glob("**/*.toml")); [tomllib.loads(p.read_text()) for p in paths]; print("parsed", len(paths), "toml files")'`
- `git diff --check`
- `pnpm exec prettier --check docs/development/workflow.md docs/planning/context/active-work.md docs/planning/context/progress-tracker.md docs/planning/feature-specs/cross-cutting/codex-subagent-workflow-configuration.md`
- `find .codex/agents -type f -name '*.toml' | sort | wc -l`
