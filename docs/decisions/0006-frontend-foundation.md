# ADR 0006: Frontend Foundation

## Status

Accepted

## Context

The platform needs a user-facing shell before end-to-end flows are wired
together. The project is still intentionally dependency-free, so introducing
Next.js, React, and UI libraries should wait until the runtime package
installation module is approved.

## Decision

Implement Module 6 as a dependency-free static frontend served by a small Node
HTTP server. The shell exposes the key operational areas and a backend health
indicator while preserving the future path toward a Next.js implementation.

## Consequences

- The frontend can run locally immediately.
- Module 7 can connect backend, parser, and AI flows with a visible shell.
- The UI remains a foundation, not a finished product experience.
- Future frontend framework migration remains straightforward.
