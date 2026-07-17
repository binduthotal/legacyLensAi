import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { requiredPackageScripts, workspacePackages } from "../scripts/workspace-packages.mjs";

const root = process.cwd();

test("workspace packages expose required tooling scripts", () => {
  for (const packageName of workspacePackages) {
    const packageJson = JSON.parse(
      readFileSync(join(root, packageName, "package.json"), "utf8"),
    );

    for (const script of requiredPackageScripts) {
      assert.ok(packageJson.scripts?.[script], `${packageName} missing ${script}`);
    }
  }
});

test("workspace packages have TypeScript entry points", () => {
  for (const packageName of workspacePackages) {
    assert.ok(
      existsSync(join(root, packageName, "src", "index.ts")),
      `${packageName} missing src/index.ts`,
    );
  }
});
