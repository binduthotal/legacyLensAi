# ADR 0001: Project Foundation

## Status

Accepted

## Context

LegacyLens AI needs a foundation that supports enterprise migration workflows,
source-grounded AI analysis, and incremental module delivery.

## Decision

Use a TypeScript-first workspace with separate top-level boundaries for the web
application, backend API, AI layer, parser, vector storage, tests, sample
projects, scripts, and documentation.

The project will use pnpm workspaces and Turborepo once dependencies are
installed. Module work must remain incremental and reviewable.

## Consequences

- Module ownership is visible from the repository root.
- AI, parser, backend, and frontend concerns can evolve independently.
- The structure supports hackathon speed without blocking production-hardening
  later.
- Initial build/test commands require dependency installation before execution.
