import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  createBackendConfig,
  createBackendRouter,
  previewProjectIntake,
  validateProjectIntake,
} from "../backend/src/index.ts";

let fixtureRoot;
let registryRoot;

test.before(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "legacylens-intake-"));
  registryRoot = await mkdtemp(join(tmpdir(), "legacylens-intake-registry-"));
  await mkdir(join(fixtureRoot, "src"), { recursive: true });

  await writeFile(join(fixtureRoot, "README.md"), "# Intake Fixture\n");
  await writeFile(join(fixtureRoot, "src", "app.ts"), "export const ok = true;\n");
  await writeFile(join(fixtureRoot, "src", "large.ts"), "x".repeat(128));
});

test.after(async () => {
  if (fixtureRoot) {
    await rm(fixtureRoot, { force: true, recursive: true });
  }
  if (registryRoot) {
    await rm(registryRoot, { force: true, recursive: true });
  }
});

test("validateProjectIntake resolves directories and applies defaults", async () => {
  const intake = await validateProjectIntake({
    projectName: " Intake Fixture ",
    sourcePath: fixtureRoot,
  });

  assert.equal(intake.projectName, "Intake Fixture");
  assert.equal(intake.maxFiles, 50);
  assert.equal(intake.maxFileSizeBytes, 1024 * 1024);
  assert.match(intake.realSourcePath, /legacylens-intake-/);
});

test("validateProjectIntake rejects unsafe limits and missing paths", async () => {
  await assert.rejects(
    () =>
      validateProjectIntake({
        projectName: "Bad",
        sourcePath: fixtureRoot,
        maxFiles: 0,
      }),
    /maxFiles must be from 1 to 500/,
  );

  await assert.rejects(
    () =>
      validateProjectIntake({
        projectName: "Bad",
        sourcePath: join(fixtureRoot, "missing"),
      }),
    /Source path was not found/,
  );
});

test("previewProjectIntake applies file size and count limits", async () => {
  const preview = await previewProjectIntake({
    projectName: "Intake Fixture",
    sourcePath: fixtureRoot,
    maxFiles: 1,
    maxFileSizeBytes: 64,
  });

  assert.equal(preview.fileCount, 2);
  assert.equal(preview.previewFileCount, 1);
  assert.deepEqual(
    preview.previewFiles.map((file) => file.path),
    ["README.md"],
  );
});

test("intake preview route returns validated preview payload", async () => {
  const router = createBackendRouter(
    createBackendConfig({
      NODE_ENV: "test",
      PROJECT_REGISTRY_FILE: join(registryRoot, "registry.json"),
    }),
  );

  const response = await router({
    method: "POST",
    url: "/api/v1/projects/intake/preview",
    body: {
      projectName: "Intake Fixture",
      sourcePath: fixtureRoot,
      maxFiles: 2,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.projectName, "Intake Fixture");
  assert.equal(response.body.previewFileCount, 2);
  assert.equal(response.body.previewFiles.length, 2);
});
