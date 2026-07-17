# Module 2: Project Workspace & Tooling

## Objective

Convert the Module 1 placeholders into a verifiable TypeScript workspace without
introducing product runtime behavior.

## Scope

- Package manifests for each workspace boundary.
- TypeScript package shells.
- Shared workspace verification scripts.
- Formatting and linting configuration baseline.
- Dependency-free validation tests for repository structure.

## Non-Goals

- No frontend runtime.
- No backend API runtime.
- No AI, parser, or vector database implementation.
- No dependency installation performed by this module.

## Validation

Run:

```bash
npm.cmd run validate
```

Once pnpm is installed, the intended workspace commands are:

```bash
pnpm install
pnpm validate
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

## Next Recommended Module

Module 3: Backend API Foundation

Suggested scope:

- Create the backend service skeleton.
- Add configuration loading.
- Add health and readiness endpoints.
- Add structured error handling.
- Add unit tests for API foundation behavior.
