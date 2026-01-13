/**
 * Shared Stylelint configuration for the TaskFlow monorepo
 * @type {import("stylelint").Config}
 */
module.exports = {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    // Allow CSS custom properties (CSS variables)
    "custom-property-pattern": null,
    // Allow at-rule-no-unknown for Tailwind and PostCSS
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
    // Allow scss/at-rule-no-unknown for SCSS features
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
    // Allow empty source for CSS modules and generated files
    "no-empty-source": null,
    // Allow duplicate selectors in different files
    "no-duplicate-selectors": null,
    // Allow unknown pseudo-classes (for Tailwind and custom utilities)
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "local", "export"],
      },
    ],
    // Allow unknown pseudo-elements
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep", "deep"],
      },
    ],
    // Allow unknown properties (for CSS-in-JS and custom properties)
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes", "compose-with"],
      },
    ],
    // Allow value-keyword-case variations
    "value-keyword-case": [
      "lower",
      {
        ignoreKeywords: ["/regexp/"],
      },
    ],
    // Allow empty blocks in CSS modules
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
