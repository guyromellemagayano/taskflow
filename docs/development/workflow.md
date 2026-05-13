# Development Workflow

## Daily Flow

1. Start with the planning chain for non-trivial work: `features -> checklist -> slices -> phases -> spec -> active work`.
2. Run `./scripts/devops/run-make.sh doctor` if the shell or machine state is uncertain.
3. Use `./scripts/devops/run-make.sh up` or `dev` for the local runtime.
4. Validate narrowly first.
5. Run `./scripts/devops/run-make.sh validate` when shared behavior is touched.
6. When dependency manifests or lockfiles change, confirm the current security posture in `docs/development/dependency-security.md` and re-run the audit commands recorded there.

## Codex Subagent Flow

- Repo-scoped custom agents live in `.codex/agents`.
- Use subagents only when the user explicitly asks for delegation, parallel agents, or a named custom agent.
- Keep the parent agent responsible for scope, docs/spec alignment, validation decisions, and final handoff.
- Prefer read-only subagents for exploration, contract mapping, review, docs research, and risk triage.
- Use workspace-write subagents only for bounded implementation or release responsibilities with clear file ownership.
- Do not let subagents bypass `AGENTS.md`, `.cursor/rules/*`, the feature-spec gate, or the active-work gate.
- If multiple implementation subagents run in parallel, give them disjoint write scopes and tell each one not to revert or overwrite other agents' changes.

## Release Slice Flow

1. Define or update the intended product surface in `docs/product/features.md`.
2. Mark shipped, partial, planned, or hardening status in `docs/product/module-feature-checklist.md`.
3. Define the product slice.
4. Place it in the correct phase.
5. Write or update the feature spec.
6. Mark the current slice in `active-work.md`.
7. Implement in bounded file or folder groups.
8. Run validation.
9. Create a grouped commit.
10. Verify the commit signature.
11. Push.

## Grouped Commit Rules

- Use `type(scope): summary`
- Add one blank line after the subject
- Use dash-prefixed bullets only
- Group by responsibility or slice first
- Use folders as a boundary only when that matches the real slice

## Signed Push Rules

- Create grouped commits with `git commit -S`
- Verify with `git verify-commit HEAD`
- Push only after the relevant local validation passes
