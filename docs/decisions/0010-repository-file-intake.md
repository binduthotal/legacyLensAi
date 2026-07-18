# ADR 0010: Repository File Intake

## Status

Accepted

## Context

The MVP can analyze a local path, but intake requests need validation before the
platform grows toward uploads and Git integrations. The project should avoid
unbounded file reads and provide a preview before analysis.

## Decision

Add a local source intake layer that validates source paths, enforces file count
and file size limits, and exposes an intake preview endpoint. Keep ZIP uploads
and Git provider integrations out of this module.

## Consequences

- Analysis requests are safer and more predictable.
- The frontend can preview intake before running analysis.
- Future upload/Git modules can reuse the same intake contract.
- The platform still supports dependency-free local development.
