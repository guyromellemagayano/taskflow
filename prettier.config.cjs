/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  plugins: [
    "prettier-plugin-pkg",
    "prettier-plugin-packagejson",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: ["**/*.{mjs,cjs,mts,cts,js,ts,jsx,tsx}"],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["**/*.{json,jsonc}"],
      options: {
        parser: "json",
      },
    },
    {
      files: ["**/*.{yaml,yml}"],
      options: {
        parser: "yaml",
      },
    },
    {
      files: ["**/*.md"],
      options: {
        parser: "markdown",
      },
    },
    {
      files: ["**/dist/**", "**/.next/**", "**/build/**", "*.d.ts"],
      options: { requirePragma: true },
    },
  ],
};
