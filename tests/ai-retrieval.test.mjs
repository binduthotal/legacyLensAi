import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmbeddingRequest,
  createGroundedAnswerPrompt,
  createKnowledgeChunk,
  createRetrievalQuery,
  rankRetrievedChunks,
  sourceGroundingSystemPrompt,
} from "../ai/src/index.ts";

test("createKnowledgeChunk normalizes content and estimates tokens", () => {
  const chunk = createKnowledgeChunk({
    id: "chunk-1",
    projectId: "project-1",
    content: "  function total() { return 1; }  ",
    source: { path: "src/legacy.ts", startLine: 10, endLine: 12 },
    language: "typescript",
  });

  assert.equal(chunk.content, "function total() { return 1; }");
  assert.equal(chunk.tokenEstimate, 8);
  assert.deepEqual(chunk.metadata, {});
});

test("createKnowledgeChunk rejects empty source context", () => {
  assert.throws(
    () =>
      createKnowledgeChunk({
        id: "empty",
        projectId: "project-1",
        content: "   ",
        source: { path: "src/empty.ts" },
        language: "typescript",
      }),
    /content cannot be empty/,
  );
});

test("createEmbeddingRequest keeps provider input source-grounded", () => {
  const chunk = createKnowledgeChunk({
    id: "chunk-2",
    projectId: "project-1",
    content: "const enabled = true;",
    source: { path: "src/settings.ts" },
    language: "typescript",
  });

  assert.deepEqual(createEmbeddingRequest(chunk), {
    chunkId: "chunk-2",
    projectId: "project-1",
    input: "const enabled = true;",
    sourcePath: "src/settings.ts",
  });
});

test("createRetrievalQuery trims questions and applies default limit", () => {
  assert.deepEqual(
    createRetrievalQuery({
      projectId: "project-1",
      question: "  where is validation handled?  ",
    }),
    {
      projectId: "project-1",
      question: "where is validation handled?",
      maxResults: 5,
    },
  );
});

test("rankRetrievedChunks sorts by score and creates citation labels", () => {
  const first = createKnowledgeChunk({
    id: "low",
    projectId: "project-1",
    content: "low relevance",
    source: { path: "src/low.ts", startLine: 3 },
    language: "typescript",
  });
  const second = createKnowledgeChunk({
    id: "high",
    projectId: "project-1",
    content: "high relevance",
    source: { path: "src/high.ts", startLine: 5, endLine: 8 },
    language: "typescript",
  });

  const results = rankRetrievedChunks(
    [first, second],
    new Map([
      ["low", 0.2],
      ["high", 0.9],
    ]),
  );

  assert.equal(results[0].chunk.id, "high");
  assert.equal(results[0].citation.label, "src/high.ts:5-8");
  assert.equal(results[1].citation.label, "src/low.ts:3");
});

test("createGroundedAnswerPrompt includes source context and citation labels", () => {
  const chunk = createKnowledgeChunk({
    id: "chunk-3",
    projectId: "project-1",
    content: "Orders are approved only after credit validation.",
    source: { path: "src/orders.ts", startLine: 42 },
    language: "typescript",
  });
  const [result] = rankRetrievedChunks([chunk], new Map([["chunk-3", 1]]));

  const prompt = createGroundedAnswerPrompt({
    question: "How are orders approved?",
    results: [result],
  });

  assert.equal(prompt.system, sourceGroundingSystemPrompt);
  assert.match(prompt.user, /Question: How are orders approved\?/);
  assert.match(prompt.user, /\[Source 1: src\/orders.ts:42\]/);
  assert.match(prompt.user, /Orders are approved only after credit validation/);
  assert.deepEqual(prompt.citations, ["src/orders.ts:42"]);
});
