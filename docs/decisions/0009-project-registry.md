# ADR 0009: Project Registry

## Status

Accepted

## Context

The end-to-end MVP flow can analyze a local project but previously returned the
result without persistence. Users need to see analyzed projects after the first
request before a database is introduced.

## Decision

Add a file-backed project registry using JSON storage at
`.legacylens/project-registry.json` by default. Keep the registry behind a small
interface so a database-backed adapter can replace it later.

## Consequences

- Analysis results survive backend restarts.
- The frontend can list analyzed projects.
- Local runtime state remains ignored by Git.
- Future persistence modules can retain the registry contract while replacing
  the file adapter.
