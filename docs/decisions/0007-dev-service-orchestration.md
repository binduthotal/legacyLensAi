# ADR 0007: Development Service Orchestration

## Status

Accepted

## Context

The workspace runner executes package scripts with `spawnSync`, which is correct
for finite commands such as build, test, lint, and typecheck. Development
servers are long-running processes and need separate orchestration so the
backend and frontend can run together.

## Decision

Use a dedicated root `scripts/dev.mjs` for `npm.cmd run dev`. Keep
`scripts/run-workspaces.mjs` for finite workspace commands. Add direct
`dev:backend` and `dev:frontend` scripts for service-specific debugging.

## Consequences

- `npm.cmd run dev` starts both the backend and frontend.
- `npm.cmd run dev:backend` starts only the backend.
- `npm.cmd run dev:frontend` starts only the frontend.
- The workspace runner remains simple and deterministic for validation commands.
