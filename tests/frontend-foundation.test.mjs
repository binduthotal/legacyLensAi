import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  createFrontendConfig,
  resolveStaticAsset,
} from "../frontend/src/index.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("frontend config uses safe defaults", () => {
  assert.deepEqual(createFrontendConfig({}), {
    host: "127.0.0.1",
    port: 3000,
    apiBaseUrl: "http://127.0.0.1:4000",
  });
});

test("frontend config validates port", () => {
  assert.throws(
    () => createFrontendConfig({ FRONTEND_PORT: "99999" }),
    /Invalid frontend port/,
  );
});

test("frontend shell contains required migration workspace sections", async () => {
  const html = await readFile(join(root, "frontend", "public", "index.html"), "utf8");

  assert.match(html, /LegacyLens AI/);
  assert.match(html, /Project Intake/);
  assert.match(html, /Project Registry/);
  assert.match(html, /Analysis Pipeline/);
  assert.match(html, /Knowledge Rules/);
  assert.match(html, /Reports/);
});

test("frontend script posts project intake to the analysis API", async () => {
  const script = await readFile(join(root, "frontend", "public", "app.js"), "utf8");

  assert.match(script, /\/api\/v1\/projects\/analyze/);
  assert.match(script, /\/api\/v1\/projects/);
  assert.match(script, /method: "POST"/);
  assert.match(script, /maxFiles: 25/);
});

test("resolveStaticAsset serves index and blocks missing files", () => {
  const publicRoot = join(root, "frontend", "public");
  const index = resolveStaticAsset(publicRoot, "/");
  const missing = resolveStaticAsset(publicRoot, "/missing.html");

  assert.ok(index);
  assert.equal(index.contentType, "text/html; charset=utf-8");
  assert.equal(missing, undefined);
});
