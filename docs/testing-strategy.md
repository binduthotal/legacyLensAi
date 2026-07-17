# Testing Strategy

## Goals

- Prove migrated behavior matches the original application.
- Catch regressions in parser, retrieval, API, and UI workflows.
- Keep tests close to module boundaries.
- Expand integration coverage as modules connect.

## Test Layers

### Unit Tests

Use for pure functions, configuration, parser contracts, AI prompt builders,
retrieval interfaces, and API service behavior.

### Integration Tests

Use for backend routes, indexing workflows, database adapters, vector storage,
and source-to-answer retrieval paths.

### End-to-End Tests

Use for browser workflows such as project ingestion, indexing status, AI chat,
report generation, and migration comparison review.

### Migration Parity Tests

Use source fixtures to compare original and migrated behavior. These tests must
cover inputs, outputs, edge cases, errors, and workflow transitions.

## Module Completion Gate

A module is not complete until:

- New behavior has tests.
- Tests pass locally or documented blockers are approved.
- Documentation reflects current behavior.
- Self-review is complete.
