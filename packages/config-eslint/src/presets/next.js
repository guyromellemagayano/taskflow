import pluginNext from "@next/eslint-plugin-next";
import mantineConfig from "eslint-config-mantine";

import { reactBaseEslintConfig } from "./react-base.js";

/**
 * Shared `eslint` configuration for apps using `next`.
 * Includes Mantine and jsx-a11y accessibility rules.
 * @type {import("eslint").Linter.Config}
 */
export const nextEslintConfig = [
  ...reactBaseEslintConfig,
  ...(Array.isArray(mantineConfig) ? mantineConfig : [mantineConfig]),
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-head-element": "off",
    },
  },
];
