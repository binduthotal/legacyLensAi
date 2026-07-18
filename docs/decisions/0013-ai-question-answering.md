# ADR 0013: Deterministic Source-Grounded Question Answering

## Status

Accepted

## Context

Users need to ask questions about analyzed projects, but the platform must stay
source-grounded and runnable before external model and vector dependencies are
introduced.

## Decision

Add a project-scoped Q&A endpoint that reconstructs source chunks from the
registered project files, ranks them with deterministic lexical scoring, and
returns answer text with citation labels.

## Consequences

- The Q&A flow works without API keys or network access.
- Answers remain constrained to analyzed source files.
- Future vector retrieval and model generation can replace the deterministic
  implementation behind the same route contract.
