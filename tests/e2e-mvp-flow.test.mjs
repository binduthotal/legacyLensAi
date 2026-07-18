import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  analyzeProject,
  createBackendConfig,
  createBackendRouter,
  createFileProjectRegistry,
} from "../backend/src/index.ts";

let fixtureRoot;
let registryRoot;
let registryFile;

test.before(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "legacylens-e2e-"));
  registryRoot = await mkdtemp(join(tmpdir(), "legacylens-registry-"));
  registryFile = join(registryRoot, "project-registry.json");
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
  if (registryRoot) {
    await rm(registryRoot, { force: true, recursive: true });
  }
});

test("analyzeProject creates a source-grounded inventory from parser and AI contracts", async () => {
  const analysis = await analyzeProject({
    projectName: "Legacy Billing",
    sourcePath: fixtureRoot,
  });

  assert.equal(analysis.projectName, "Legacy Billing");
  assert.equal(analysis.projectId, "legacy-billing");
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

test("file project registry persists and updates analysis summaries", async () => {
  const registry = createFileProjectRegistry(registryFile);
  const analysis = await analyzeProject({
    projectName: "Legacy Billing",
    sourcePath: fixtureRoot,
    maxFiles: 2,
  });

  const saved = await registry.save(analysis);
  const listed = await registry.list();
  const loaded = await registry.get("legacy-billing");

  assert.equal(saved.id, "legacy-billing");
  assert.equal(listed.length, 1);
  assert.equal(loaded.projectName, "Legacy Billing");
  assert.equal(loaded.analyzedFileCount, 2);
});

test("project analysis route validates and returns the MVP analysis payload", async () => {
  const router = createBackendRouter(
    createBackendConfig({
      NODE_ENV: "test",
      PROJECT_REGISTRY_FILE: registryFile,
    }),
  );
  const response = await router({
    method: "POST",
    url: "/api/v1/projects/analyze",
    body: {
      projectName: "Legacy Billing",
      sourcePath: fixtureRoot,
      maxFiles: 2,
      maxFileSizeBytes: 1024 * 1024,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.id, "legacy-billing");
  assert.equal(response.body.fileCount, 3);
  assert.equal(response.body.analyzedFileCount, 2);
  assert.equal(response.body.knowledgeChunks.length, 2);

  const listResponse = await router({
    method: "GET",
    url: "/api/v1/projects",
  });
  const detailResponse = await router({
    method: "GET",
    url: "/api/v1/projects/legacy-billing",
  });

  assert.equal(listResponse.statusCode, 200);
  assert.equal(listResponse.body.projects.length, 1);
  assert.equal(detailResponse.statusCode, 200);
  assert.equal(detailResponse.body.id, "legacy-billing");

  const fileResponse = await router({
    method: "GET",
    url: "/api/v1/projects/legacy-billing/files?path=src%2Fbilling.ts",
  });

  assert.equal(fileResponse.statusCode, 200);
  assert.equal(fileResponse.body.path, "src/billing.ts");
  assert.equal(fileResponse.body.citationLabel, "src/billing.ts:1-4");
  assert.match(fileResponse.body.content, /approveInvoice/);
});

test("project file route rejects files outside the analyzed inventory", async () => {
  const router = createBackendRouter(
    createBackendConfig({
      NODE_ENV: "test",
      PROJECT_REGISTRY_FILE: registryFile,
    }),
  );

  const response = await router({
    method: "GET",
    url: "/api/v1/projects/legacy-billing/files?path=..%2Fsecret.txt",
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error.code, "INVALID_SOURCE_FILE_PATH");
});

test("project analysis route rejects invalid payloads with structured errors", async () => {
  const router = createBackendRouter(
    createBackendConfig({
      NODE_ENV: "test",
      PROJECT_REGISTRY_FILE: registryFile,
    }),
  );
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
