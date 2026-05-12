# Development Workflow

## Daily Flow

1. Start with the planning chain for non-trivial work.
2. Run `./scripts/devops/run-make.sh doctor` if the shell or machine state is uncertain.
3. Use `./scripts/devops/run-make.sh up` or `dev` for the local runtime.
4. Validate narrowly first.
5. Run `./scripts/devops/run-make.sh validate` when shared behavior is touched.

## Release Slice Flow

1. Define the product slice.
2. Place it in the correct phase.
3. Write or update the feature spec.
4. Mark the current slice in `active-work.md`.
5. Implement in bounded file or folder groups.
6. Run validation.
7. Create a grouped commit.
8. Verify the commit signature.
9. Push.

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
