# Auth And Session Foundation

## Purpose

Define the baseline TaskFlow auth contract that lets a user enter the product, restore a session, and leave it safely.

## Intended Outcome

- A user can sign up, log in, land in the authenticated product, refresh tokens, and log out.
- Protected task data remains scoped to the authenticated user.
- Session primitives exist in both the web and API layers so later task work can rely on them.

## Delivered Scope

- `/login` and `/signup` pages in the web app.
- GraphQL `register`, `login`, `refreshToken`, `logout`, and `me` operations.
- REST `/auth/login`, `/auth/refresh`, and `/auth/logout` endpoints.
- Web auth context that restores the current user and redirects into or out of the protected workspace.
- Redis-backed refresh-token storage, revocation, and rotation behavior.

## Constraints Carried Forward

- The browser contract is split between GraphQL-driven token persistence in the web app and REST endpoints that set cookies.
- Registration is exposed through GraphQL, not through a matching REST registration endpoint.
- The session model is functional today but still needs one authoritative browser transport contract.

## Follow-On Work

- Normalize browser auth transport so GraphQL and REST auth do not feel like competing sources of truth.
- Extend coverage around session edge cases once real end-to-end browser tests are in place.
