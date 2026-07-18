import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  createSourceArtifact,
  detectLanguage,
  discoverSourceFiles,
} from "../parser/src/index.ts";

let fixtureRoot;

test.before(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "legacylens-parser-"));
  await mkdir(join(fixtureRoot, "src"), { recursive: true });
  await mkdir(join(fixtureRoot, "node_modules", "ignored"), { recursive: true });

  await writeFile(
    join(fixtureRoot, "README.md"),
    "# Fixture\n\nA tiny legacy-style project for parser tests.\n",
  );
  await writeFile(
    join(fixtureRoot, "src", "legacy.ts"),
    "export function total(left: number, right: number) {\n  return left + right;\n}\n",
  );
  await writeFile(
    join(fixtureRoot, "src", "settings.json"),
    "{\n  \"featureEnabled\": true\n}\n",
  );
  await writeFile(
    join(fixtureRoot, "node_modules", "ignored", "generated.js"),
    "throw new Error('ignore me');\n",
  );
});

test.after(async () => {
  if (fixtureRoot) {
    await rm(fixtureRoot, { force: true, recursive: true });
  }
});

test("detectLanguage identifies common legacy project file types", () => {
  assert.equal(detectLanguage("src/index.ts"), "typescript");
  assert.equal(detectLanguage("src/index.js"), "javascript");
  assert.equal(detectLanguage("README.md"), "markdown");
  assert.equal(detectLanguage("pom.xml"), "xml");
  assert.equal(detectLanguage("unknown.lock"), "unknown");
});

test("discoverSourceFiles returns sorted source files and ignores generated folders", async () => {
  const files = await discoverSourceFiles(fixtureRoot);

  assert.deepEqual(
    files.map((file) => file.relativePath),
    ["README.md", "src/legacy.ts", "src/settings.json"],
  );
  assert.deepEqual(
    files.map((file) => file.language),
    ["markdown", "typescript", "json"],
  );
});

test("createSourceArtifact preserves content metadata for downstream parsers", async () => {
  const files = await discoverSourceFiles(fixtureRoot);
  const legacyFile = files.find((file) => file.relativePath === "src/legacy.ts");

  assert.ok(legacyFile);

  const artifact = await createSourceArtifact(legacyFile);

  assert.equal(artifact.path, "src/legacy.ts");
  assert.equal(artifact.language, "typescript");
  assert.equal(artifact.lineCount, 4);
  assert.match(artifact.content, /function total/);
});
