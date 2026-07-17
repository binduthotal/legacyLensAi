import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageRoot = resolve(process.argv[2] ?? process.cwd());
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

const packageJson = readJson(resolve(packageRoot, "package.json"));
const tsconfig = readJson(resolve(packageRoot, "tsconfig.json"));

requireFile(resolve(packageRoot, "README.md"));
requireFile(resolve(packageRoot, "src", "index.ts"));

if (packageJson) {
  if (packageJson.private !== true) {
    failures.push("Package must remain private until publication is approved.");
  }

  if (!packageJson.exports?.["."]) {
    failures.push("Package must expose its public shell through exports['.'].");
  }
}

if (tsconfig && tsconfig.extends !== "../tsconfig.base.json") {
  failures.push("Package tsconfig must extend ../tsconfig.base.json.");
}

if (failures.length > 0) {
  console.error("Package verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Package verification passed: ${packageRoot}`);
