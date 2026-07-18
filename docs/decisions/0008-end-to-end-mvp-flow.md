# ADR 0008: End-to-End MVP Flow

## Status

Accepted

## Context

The project now has independent backend, parser, AI, and frontend foundations.
The next step is to prove that those boundaries can cooperate in a single
workflow without introducing persistence or external providers.

## Decision

Add a backend analysis route that accepts a local project path, uses the parser
to discover files and create artifacts, converts those artifacts into AI
knowledge chunk metadata, and returns the result to the frontend.

## Consequences

- The platform has its first vertical MVP slice.
- The flow remains dependency-free and testable.
- Future modules can add persistence, embeddings, vector search, and richer UI
  views without changing the basic orchestration contract.
