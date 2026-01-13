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
  parser: "json-stringify",
  overrides: [
    {
      files: ["**/*.{mjs,cjs,mts,cts,js,ts,jsx,tsx}"],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["**/dist/**", "**/.next/**", "**/build/**", "*.d.ts"],
      options: { requirePragma: true },
    },
  ],
};
