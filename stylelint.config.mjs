/**
 * Shared Stylelint configuration for the TaskFlow monorepo
 * @type {import("stylelint").Config}
 */
export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "custom-property-pattern": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "mixin",
          "include",
          "use",
          "forward",
        ],
      },
    ],
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
        ],
      },
    ],
    "no-empty-source": null,
    "no-duplicate-selectors": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "local", "export"],
      },
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep", "deep"],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes", "compose-with"],
      },
    ],
    "value-keyword-case": [
      "lower",
      {
        ignoreKeywords: ["/regexp/"],
      },
    ],
    "block-no-empty": null,
  },
  ignoreFiles: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/coverage/**",
    "**/*.min.css",
    "**/vendor/**",
  ],
};
