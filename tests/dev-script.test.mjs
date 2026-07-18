import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

test("root dev script uses dedicated service orchestration", async () => {
  const packageJson = JSON.parse(
    await readFile(join(root, "package.json"), "utf8"),
  );

  assert.equal(packageJson.scripts.dev, "node scripts/dev.mjs");
  assert.equal(packageJson.scripts["dev:backend"], "node backend/src/main.ts");
  assert.equal(packageJson.scripts["dev:frontend"], "node frontend/src/main.ts");
});

test("workspace runner remains reserved for finite commands", async () => {
  const runner = await readFile(join(root, "scripts", "run-workspaces.mjs"), "utf8");

  assert.match(runner, /spawnSync/);
  assert.doesNotMatch(runner, /run-workspaces\.mjs dev/);
});
