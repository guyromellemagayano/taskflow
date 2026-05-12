#!/bin/zsh

set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname "$0")/../.." && pwd)

if [ -z "${NVM_DIR:-}" ]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  printf 'nvm.sh not found at %s\n' "$NVM_DIR/nvm.sh" >&2
  exit 1
fi

. "$NVM_DIR/nvm.sh"

cd "$ROOT_DIR"
nvm use --silent
export TASKFLOW_NVM_WRAPPED=1
exec make "$@"
