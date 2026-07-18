# ADR 0012: Source File Viewer

## Status

Accepted

## Context

The frontend can display a file inventory, but users need to inspect the actual
source behind citations before relying on generated migration knowledge.

## Decision

Add a source file endpoint that only serves files already present in a persisted
project record. The frontend opens files from the inventory and displays source
content with a citation label.

## Consequences

- Users can verify source-backed analysis.
- File reads are constrained to analyzed project inventory.
- Future citation navigation and AI chat can reuse the source file endpoint.
