# Mise Runtime Migration

## Spec Class And Status

- Spec class: `Delivery`
- Status: `Complete`
- Authorization: operator requested mise adoption and complete local NVM retirement on October 19, 2026.

## Problem And Operator Outcome

The host launcher directly loads the retired version manager. Adopt mise while preserving Node 24.17.0, pnpm 11.22.0, Corepack, and the existing Compose runtime.

## Scope And Owning Boundaries

- Runtime: `.node-version`, launcher, doctor, Make wrapper guard, and CI version-file references.
- Documentation: README, runtime architecture, runtime agent, active-work and progress records.
- Non-goals: application changes, dependency upgrades, Docker changes, data mutations, commits, and publication. Historical validation records remain unchanged.

## Acceptance Checks

- Root and nested commands select the existing exact Node and pnpm versions.
- The launcher runs through `mise exec` without interactive shell hooks.
- CI with the correct Node can run the launcher without mise installed.
- Diagnostics read `.node-version`; no live launcher depends on the retired manager.

## Validation Plan

- Tier: focused runtime and workflow checks.
- Shell syntax, Make help and doctor, root/nested version selection, launcher fallback behavior, changed TOML parsing, changed-file formatting, and `git diff --check`.
- Publication also requires `./scripts/devops/run-make.sh release-check` under the repository release workflow.

## Validation Results

- October 19, 2026: plain `make doctor` passed after removal of the old host installation; Node 24.17.0, pnpm 11.22.0, engine and Docker pins, and Compose configuration matched.
- ShellCheck, shfmt, shell syntax, changed-file Prettier, agent TOML parsing, root/nested runtime selection, launcher use from outside the repository, exact-Node CI fallback without mise, missing-runtime failure, and diff hygiene passed.
- GUI-hook runtime selection was simulated through the shared Husky initialization.
- Packaging validation on October 19, 2026: `./scripts/devops/run-make.sh release-check` passed formatting, type checks, lint, 22 JavaScript tests, 7 API tests, 4 worker tests, JavaScript production builds, API/worker/web image builds, and diff hygiene. Commit hooks and publication checks run separately during packaging.

## Sources

- https://mise.jdx.dev/lang/node.html
- https://mise.jdx.dev/cli/exec.html
