/** @type {import('lint-staged').Config} */
module.exports = {
  // Only run ESLint on files in directories with ESLint configs
  "apps/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "packages/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  // Root-level config files: only format, no linting
  "*.{js,mjs,cjs}": ["prettier --write"],
  "*.{json,jsonc}": ["prettier --write"],
  "*.{yaml,yml}": ["prettier --write"],
  "*.md": ["prettier --write"],
  "*.py": ["ruff check --fix", "ruff format"],
  "**/package.json": ["prettier --write"],
};
