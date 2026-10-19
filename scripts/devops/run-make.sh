#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname "$0")/../.." && pwd)
cd "$ROOT_DIR"
export TASKFLOW_RUNTIME_WRAPPED=1
EXPECTED_NODE_VERSION=$(tr -d '[:space:]' <"$ROOT_DIR/.node-version")

if command -v mise >/dev/null 2>&1; then
  exec mise exec "node@${EXPECTED_NODE_VERSION#v}" -- make "$@"
fi

# CI and containers may already provide the exact runtime without mise.
if command -v node >/dev/null 2>&1 && [ "$(node --version)" = "v${EXPECTED_NODE_VERSION#v}" ]; then
  exec make "$@"
fi

printf 'Install mise, enable Node version files, and run "mise install" from the repository root.\n' >&2
exit 1
