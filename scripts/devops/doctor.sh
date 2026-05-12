#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname "$0")/../.." && pwd)
FAILED=0
DOCKER_AVAILABLE=0
COMPOSE_AVAILABLE=0
EXPECTED_NODE_RAW=$(tr -d '[:space:]' <"$ROOT_DIR/.nvmrc")
EXPECTED_NODE_VERSION=${EXPECTED_NODE_RAW#v}
EXPECTED_NODE_TAG="v${EXPECTED_NODE_VERSION}"
EXPECTED_PNPM_VERSION=$(sed -n 's/.*"packageManager": "pnpm@\([^+"]*\)+.*/\1/p' "$ROOT_DIR/package.json")

printf '\nTaskFlow local runtime doctor\n\n'

if ! command -v docker >/dev/null 2>&1; then
  printf 'docker: missing\n' >&2
  FAILED=1
elif ! docker info >/dev/null 2>&1; then
  printf 'docker: unavailable\n' >&2
  FAILED=1
else
  printf 'docker: ok\n'
  DOCKER_AVAILABLE=1
fi

if [ "$DOCKER_AVAILABLE" -eq 1 ] && docker compose version >/dev/null 2>&1; then
  printf 'docker compose: ok\n'
  COMPOSE_AVAILABLE=1
else
  printf 'docker compose: unavailable\n' >&2
  FAILED=1
fi

if [ -f "$ROOT_DIR/.env" ]; then
  printf '.env: ok\n'
else
  printf '.env: not present; copy .env.example if you need local overrides\n'
fi

printf '\nNode runtime\n'
if command -v node >/dev/null 2>&1; then
  CURRENT_NODE_VERSION=$(node --version)
  if [ "$CURRENT_NODE_VERSION" = "$EXPECTED_NODE_TAG" ]; then
    printf 'host node: ok (%s)\n' "$CURRENT_NODE_VERSION"
  else
    printf 'host node: %s, expected %s from .nvmrc\n' "$CURRENT_NODE_VERSION" "$EXPECTED_NODE_TAG" >&2
    printf 'Run "nvm use" from the repository root or use ./scripts/devops/run-make.sh.\n' >&2
    FAILED=1
  fi
else
  printf 'host node: missing; install and activate %s with nvm\n' "$EXPECTED_NODE_TAG" >&2
  FAILED=1
fi

if command -v pnpm >/dev/null 2>&1; then
  CURRENT_PNPM_VERSION=$(pnpm --version)
  if [ "$CURRENT_PNPM_VERSION" = "$EXPECTED_PNPM_VERSION" ]; then
    printf 'host pnpm: ok (%s)\n' "$CURRENT_PNPM_VERSION"
  else
    printf 'host pnpm: %s, expected %s from packageManager\n' "$CURRENT_PNPM_VERSION" "$EXPECTED_PNPM_VERSION" >&2
    FAILED=1
  fi
else
  printf 'host pnpm: missing; run "corepack enable" after activating Node %s\n' "$EXPECTED_NODE_TAG" >&2
  FAILED=1
fi

if grep -q "\"node\": \"$EXPECTED_NODE_VERSION\"" "$ROOT_DIR/package.json"; then
  printf 'package engines.node: ok (%s)\n' "$EXPECTED_NODE_VERSION"
else
  printf 'package engines.node: expected %s to match .nvmrc\n' "$EXPECTED_NODE_VERSION" >&2
  FAILED=1
fi

if grep -q "\"pnpm\": \"$EXPECTED_PNPM_VERSION\"" "$ROOT_DIR/package.json"; then
  printf 'package engines.pnpm: ok (%s)\n' "$EXPECTED_PNPM_VERSION"
else
  printf 'package engines.pnpm: expected %s to match packageManager\n' "$EXPECTED_PNPM_VERSION" >&2
  FAILED=1
fi

if grep -Eq "^FROM node:${EXPECTED_NODE_VERSION%%.*}(-|:|$)" "$ROOT_DIR/apps/web/Dockerfile"; then
  printf 'web docker node major: ok (%s.x)\n' "${EXPECTED_NODE_VERSION%%.*}"
else
  printf 'web docker node major: expected Node %s.x base image in apps/web/Dockerfile\n' "${EXPECTED_NODE_VERSION%%.*}" >&2
  FAILED=1
fi

printf '\nCompose config\n'
if [ "$COMPOSE_AVAILABLE" -eq 1 ]; then
  docker compose -f "$ROOT_DIR/docker-compose.yml" config >/dev/null
  printf 'compose config: valid\n'
else
  printf 'compose config: skipped because docker compose is unavailable\n' >&2
fi

exit "$FAILED"
