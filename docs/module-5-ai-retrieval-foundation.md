# Module 5: AI Retrieval Foundation

## Objective

Create provider-neutral AI retrieval contracts that keep future AI answers
grounded in indexed source artifacts.

## Scope

- Knowledge chunk and citation models.
- Embedding request and provider contracts.
- Retrieval query, retriever, and ranked result contracts.
- Source-grounded prompt construction.
- Tests for chunk validation, embedding requests, ranking, citations, and prompt
  content.

## Public AI API

The AI package exports:

- `createKnowledgeChunk`
- `createEmbeddingRequest`
- `createRetrievalQuery`
- `rankRetrievedChunks`
- `createGroundedAnswerPrompt`
- `EmbeddingProvider`
- `Retriever`
- `KnowledgeChunk`
- `RetrievalResult`
- `Citation`

## Grounding Rule

AI answers must be based on supplied source context. When the context is
insufficient, the assistant must say what is missing instead of inventing
behavior.

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run test
npm.cmd run build
```

## Non-Goals

- No OpenAI SDK integration.
- No live embedding generation.
- No vector database implementation.
- No answer generation endpoint.

## Next Recommended Module

Module 6: Frontend Foundation

Suggested scope:

- Create the web application shell.
- Add navigation and project onboarding placeholders.
- Add status views for backend health and future indexing jobs.
- Add focused UI tests for the shell.
