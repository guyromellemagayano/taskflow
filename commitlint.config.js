/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // A new feature
        "fix", // A bug fix
        "docs", // Documentation only changes
        "style", // Changes that do not affect the meaning of the code
        "refactor", // A code change that neither fixes a bug nor adds a feature
        "perf", // A code change that improves performance
        "test", // Adding missing tests or correcting existing tests
        "build", // Changes that affect the build system or external dependencies
        "ci", // Changes to CI configuration files and scripts
        "chore", // Other changes that don't modify src or test files
        "revert", // Reverts a previous commit
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 250],
    "footer-leading-blank": [2, "always"],
  },
  prompt: {
    // Monorepo scopes
    scopes: [
      { value: "web", name: "web:     Frontend (Next.js)" },
      { value: "api", name: "api:     Backend (FastAPI)" },
      { value: "worker", name: "worker:  Celery worker" },
      { value: "shared", name: "shared:  Shared TypeScript types" },
      { value: "graphql", name: "graphql: GraphQL schema" },
      { value: "ui", name: "ui:      Shared UI components" },
      { value: "deps", name: "deps:    Dependencies" },
      { value: "config", name: "config:  Configuration files" },
      { value: "docker", name: "docker:  Docker setup" },
      { value: "ci", name: "ci:      CI/CD configuration" },
    ],
    // Enable emoji in commit messages (optional)
    useEmoji: false,
    // Allow empty scope
    allowEmptyScopes: true,
    // Allow breaking changes
    markBreakingChangeMode: true,
  },
};
