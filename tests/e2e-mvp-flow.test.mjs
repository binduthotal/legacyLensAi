import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  analyzeProject,
  createBackendConfig,
  createBackendRouter,
} from "../backend/src/index.ts";

let fixtureRoot;

test.before(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "legacylens-e2e-"));
  await mkdir(join(fixtureRoot, "src"), { recursive: true });
  await mkdir(join(fixtureRoot, "dist"), { recursive: true });

  await writeFile(
    join(fixtureRoot, "README.md"),
    "# Legacy Billing\n\nInvoices are approved after account validation.\n",
  );
  await writeFile(
    join(fixtureRoot, "src", "billing.ts"),
    "export function approveInvoice(accountValid) {\n  return accountValid === true;\n}\n",
  );
  await writeFile(
    join(fixtureRoot, "src", "settings.json"),
    "{\n  \"approvalMode\": \"account-validation\"\n}\n",
  );
  await writeFile(join(fixtureRoot, "dist", "bundle.js"), "generated();\n");
});

test.after(async () => {
  if (fixtureRoot) {
    await rm(fixtureRoot, { force: true, recursive: true });
  }
});

test("analyzeProject creates a source-grounded inventory from parser and AI contracts", async () => {
  const analysis = await analyzeProject({
    projectName: "Legacy Billing",
    sourcePath: fixtureRoot,
  });

  assert.equal(analysis.projectName, "Legacy Billing");
  assert.equal(analysis.fileCount, 3);
  assert.equal(analysis.analyzedFileCount, 3);
  assert.deepEqual(
    analysis.files.map((file) => file.path),
    ["README.md", "src/billing.ts", "src/settings.json"],
  );
  assert.deepEqual(
    analysis.languages.map((item) => item.language),
    ["json", "markdown", "typescript"],
  );
  assert.equal(analysis.knowledgeChunks.length, 3);
  assert.equal(analysis.knowledgeChunks[0].projectId, "legacy-billing");
  assert.equal(analysis.knowledgeChunks[1].source.path, "src/billing.ts");
});

test("project analysis route validates and returns the MVP analysis payload", async () => {
  const router = createBackendRouter(createBackendConfig({ NODE_ENV: "test" }));
  const response = await router({
    method: "POST",
    url: "/api/v1/projects/analyze",
    body: {
      projectName: "Legacy Billing",
      sourcePath: fixtureRoot,
      maxFiles: 2,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.fileCount, 3);
  assert.equal(response.body.analyzedFileCount, 2);
  assert.equal(response.body.knowledgeChunks.length, 2);
});

test("project analysis route rejects invalid payloads with structured errors", async () => {
  const router = createBackendRouter(createBackendConfig({ NODE_ENV: "test" }));
  const response = await router({
    method: "POST",
    url: "/api/v1/projects/analyze",
    body: {
      projectName: "",
      sourcePath: fixtureRoot,
    },
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error.code, "INVALID_PROJECT_NAME");
});
