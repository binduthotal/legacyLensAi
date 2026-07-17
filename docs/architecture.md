# Architecture

## Architectural Style

LegacyLens AI follows Clean Architecture principles. Domain contracts sit at the
center, while frameworks, databases, AI providers, and UI concerns remain
replaceable implementation details.

## System Boundaries

```text
frontend -> backend -> parser
                  -> ai
                  -> vector_db
                  -> database
```

## Components

### frontend

Owns the user experience for repository onboarding, indexing status, AI chat,
architecture views, reports, and migration review workflows.

### backend

Owns API routes, authentication, authorization, orchestration, job scheduling,
configuration, observability, and persistence coordination.

### parser

Owns repository inspection, file discovery, language detection, source chunking,
dependency extraction, symbol extraction, and static analysis contracts.

### ai

Owns prompts, retrieval orchestration, source-grounded answer generation,
evaluation, and model-provider adapters.

### vector_db

Owns vector database adapters, embedding persistence, search contracts, and
retrieval performance boundaries.

### tests

Owns cross-module fixtures, integration tests, and migration validation assets.

## Design Principles

- Source-grounded answers must cite files or indexed artifacts.
- AI output must not be treated as authoritative without source backing.
- Parsing and retrieval contracts must be testable without the UI.
- Provider-specific code must remain behind interfaces.
- Migration behavior must be compared against the original system before signoff.

## Initial Runtime View

1. A user uploads or connects a legacy project.
2. The backend creates an indexing job.
3. The parser discovers files, dependencies, symbols, and chunks.
4. The AI layer generates embeddings and summaries.
5. The vector layer stores searchable knowledge.
6. The frontend exposes chat, documentation, and architecture views.
