# ADR 0002: Workspace Tooling

## Status

Accepted

## Context

The project needs repeatable verification before product features are added.
The local machine does not currently expose `pnpm` in PowerShell, so Module 2
must remain verifiable with plain Node while still documenting the intended pnpm
workspace flow.

## Decision

Keep pnpm workspaces as the intended package manager, define TypeScript package
shells for each boundary, and add dependency-free Node validation scripts that
can run before dependencies are installed.

## Consequences

- The repository can be validated immediately with `npm.cmd run validate`.
- Future modules can replace shell verification with real build, lint,
  typecheck, and test commands as dependencies become available.
- Product runtime behavior remains untouched until approved in a later module.
