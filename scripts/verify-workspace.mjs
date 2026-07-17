import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { requiredPackageScripts, workspacePackages } from "./workspace-packages.mjs";

const root = process.cwd();
const failures = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
    return undefined;
  }
}

function requireFile(path) {
  if (!existsSync(path)) {
    failures.push(`Missing required file: ${path}`);
  }
}

const rootPackage = readJson(join(root, "package.json"));
if (rootPackage) {
  for (const script of ["build", "dev", "lint", "test", "typecheck", "validate"]) {
    if (!rootPackage.scripts?.[script]) {
      failures.push(`Root package is missing script: ${script}`);
    }
  }
}

requireFile(join(root, "pnpm-workspace.yaml"));
requireFile(join(root, "turbo.json"));
requireFile(join(root, "tsconfig.base.json"));
requireFile(join(root, ".editorconfig"));
requireFile(join(root, ".prettierrc.json"));
requireFile(join(root, "eslint.config.mjs"));

for (const packageName of workspacePackages) {
  const packageRoot = join(root, packageName);
  const packageJsonPath = join(packageRoot, "package.json");
  const packageJson = readJson(packageJsonPath);

  requireFile(join(packageRoot, "README.md"));
  requireFile(join(packageRoot, "tsconfig.json"));
  requireFile(join(packageRoot, "src", "index.ts"));

  if (!packageJson) {
    continue;
  }

  if (packageJson.private !== true) {
    failures.push(`${packageName}/package.json must be private`);
  }

  for (const script of requiredPackageScripts) {
    if (!packageJson.scripts?.[script]) {
      failures.push(`${packageName}/package.json is missing script: ${script}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Workspace verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Workspace verification passed for ${workspacePackages.length} packages.`);
