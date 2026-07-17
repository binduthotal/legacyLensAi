# ADR 0003: Backend API Foundation

## Status

Accepted

## Context

The platform needs a backend boundary before ingestion, parser, AI, and vector
storage modules are connected. The local environment can run Node but does not
currently have workspace dependencies installed.

## Decision

Implement the first backend API foundation with Node built-ins only. Provide
configuration loading, health/readiness routes, structured error responses, and
a server factory that can later be replaced or wrapped by Fastify when
dependencies are installed.

## Consequences

- The backend can run and be tested immediately.
- Future modules have a concrete API boundary to extend.
- No external runtime dependency is introduced in this module.
- The implementation remains intentionally small until API requirements expand.
