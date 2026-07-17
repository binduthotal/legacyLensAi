import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { workspacePackages } from "./workspace-packages.mjs";

const command = process.argv[2];

if (!command) {
  console.error("Usage: node scripts/run-workspaces.mjs <script>");
  process.exit(1);
}

let exitCode = 0;

for (const packageName of workspacePackages) {
  const packageRoot = join(process.cwd(), packageName);
  const packageJsonPath = join(packageRoot, "package.json");

  if (!existsSync(packageJsonPath)) {
    console.error(`Missing package.json for workspace package: ${packageName}`);
    exitCode = 1;
    continue;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const script = packageJson.scripts?.[command];

  if (!script) {
    console.log(`Skipping ${packageName}: no ${command} script`);
    continue;
  }

  console.log(`\n> ${packageName}: ${command}`);
  const result = spawnSync(script, {
    cwd: packageRoot,
    shell: true,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    exitCode = result.status ?? 1;
    break;
  }
}

process.exit(exitCode);
