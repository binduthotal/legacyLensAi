# ADR 0011: Project Detail and Source Inventory UI

## Status

Accepted

## Context

Projects can now be analyzed and persisted, but the frontend only displayed a
short project summary. Users need to inspect what was analyzed before trusting
future migration or AI outputs.

## Decision

Add a dependency-free project detail UI with language metrics, file inventory,
and source chunk citation previews. Keep it static and simple until a frontend
framework is introduced.

## Consequences

- Users can verify analyzed project contents.
- Source-grounding concepts become visible in the UI.
- Future source viewers and AI chat can build on the same project record shape.
