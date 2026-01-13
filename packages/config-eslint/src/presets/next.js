import mantineConfig from "eslint-config-mantine";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginNext from "@next/eslint-plugin-next";

import { reactBaseEslintConfig } from "./react-base.js";

/**
 * Shared `eslint` configuration for apps using `next`.
 * Includes Mantine and jsx-a11y accessibility rules.
 * @type {import("eslint").Linter.Config}
 */
export const nextEslintConfig = [
  ...reactBaseEslintConfig,
  // eslint-config-mantine may export as array or single config object
  ...(Array.isArray(mantineConfig) ? mantineConfig : [mantineConfig]),
  {
    plugins: {
      "@next/next": pluginNext,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      ...jsxA11y.configs.recommended.rules,
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-head-element": "off",
    },
  },
];
