/** @type {import('lint-staged').Config} */
const path = require("path");

function getPackageDir(file) {
  const parts = file.split(path.sep);
  if (parts[0] === "apps" && parts.length >= 2) {
    return `apps/${parts[1]}`;
  }
  if (parts[0] === "packages" && parts.length >= 2) {
    return `packages/${parts[1]}`;
  }
  return null;
}

module.exports = {
  // Run ESLint from the package directory where config exists
  "apps/**/*.{js,jsx,ts,tsx}": (filenames) => {
    const commands = [];
    const filesByPackage = {};

    // Group files by package
    filenames.forEach((file) => {
      const pkgDir = getPackageDir(file);
      if (pkgDir) {
        if (!filesByPackage[pkgDir]) {
          filesByPackage[pkgDir] = [];
        }
        filesByPackage[pkgDir].push(file);
      }
    });

    // Create commands for each package
    Object.entries(filesByPackage).forEach(([pkgDir, files]) => {
      const relativeFiles = files.map((f) => path.relative(pkgDir, f));
      commands.push(
        `(cd ${pkgDir} && eslint --fix ${relativeFiles.join(" ")})`
      );
      commands.push(`prettier --write ${files.join(" ")}`);
    });

    return commands;
  },
  "packages/**/*.{js,jsx,ts,tsx}": (filenames) => {
    const commands = [];
    const filesByPackage = {};

    // Group files by package
    filenames.forEach((file) => {
      const pkgDir = getPackageDir(file);
      if (pkgDir) {
        if (!filesByPackage[pkgDir]) {
          filesByPackage[pkgDir] = [];
        }
        filesByPackage[pkgDir].push(file);
      }
    });

    // Create commands for each package
    Object.entries(filesByPackage).forEach(([pkgDir, files]) => {
      const relativeFiles = files.map((f) => path.relative(pkgDir, f));
      commands.push(
        `(cd ${pkgDir} && eslint --fix ${relativeFiles.join(" ")})`
      );
      commands.push(`prettier --write ${files.join(" ")}`);
    });

    return commands;
  },
  // Root-level config files: only format, no linting
  "*.{js,mjs,cjs}": ["prettier --write"],
  "*.{json,jsonc}": ["prettier --write"],
  "*.{yaml,yml}": ["prettier --write"],
  "*.md": ["prettier --write"],
  "*.py": ["ruff check --fix", "ruff format"],
  "**/package.json": ["prettier --write"],
};
