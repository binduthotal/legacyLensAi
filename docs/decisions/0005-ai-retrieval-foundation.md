# ADR 0005: AI Retrieval Foundation

## Status

Accepted

## Context

LegacyLens AI must eventually answer questions about legacy systems without
inventing unsupported behavior. Before provider integrations are introduced, the
project needs stable contracts for source chunks, citations, embeddings,
retrieval, and prompt construction.

## Decision

Implement provider-neutral AI retrieval contracts with deterministic helpers and
tests. Keep model providers, vector databases, and live answer generation out of
this module.

## Consequences

- Future OpenAI and vector database adapters can plug into stable interfaces.
- Prompt construction consistently includes source context and citation labels.
- Source grounding is encoded before any model call is added.
- Runtime behavior remains dependency-free for this module.
