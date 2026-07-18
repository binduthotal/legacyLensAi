# LegacyLens AI

LegacyLens AI is an AI-powered legacy code knowledge transfer platform for
enterprise modernization teams. Its purpose is to help engineers understand
existing systems before migration, preserve business behavior, and produce
traceable modernization documentation.

## Core Objective

Deliver production-ready migrations that faithfully reproduce the original
application's functionality, business logic, workflows, APIs, and user
experience in the target technology stack.

This repository is currently in **Module 6: Frontend Foundation**. The backend
has a minimal API shell, the parser and AI layers expose source-grounded
contracts, and the frontend has a runnable workspace shell.

## Planned Capabilities

- Legacy application ingestion from repositories, folders, archives, and
  documentation.
- Codebase analysis for architecture, dependencies, workflows, and business
  rules.
- Retrieval-augmented AI assistant with source citations.
- Migration planning, module tracking, and behavior preservation reports.
- Generated onboarding, architecture, API, testing, and migration documentation.
- Visual dependency and workflow maps.

## Repository Layout

```text
legacyLensAI/
  frontend/         Web application shell and user experience.
  backend/          API, orchestration, auth, and project workflows.
  parser/           Code parsing, language detection, and dependency analysis.
  ai/               Prompts, retrieval, embeddings, and AI workflows.
  vector_db/        Vector storage adapters and indexing contracts.
  scripts/          Developer and maintenance scripts.
  tests/            Cross-module test fixtures and integration tests.
  sample_projects/  Sample legacy applications used for validation.
  docs/             Architecture, migration, testing, and decision records.
```

## Recommended Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Flow
- Backend: Node.js, TypeScript, Fastify, Prisma, BullMQ, Redis
- Data: PostgreSQL with pgvector for the MVP
- AI: OpenAI API for embeddings, code reasoning, summarization, and chat
- Parsing: Tree-sitter first, with language-specific analyzers added by module
- Testing: Vitest for units, Playwright for workflows, integration tests for APIs
- Tooling: pnpm workspaces, Turborepo, ESLint, Prettier, Docker Compose

## Module Execution Model

Development is intentionally incremental:

1. Analyze the current system and affected dependencies.
2. Plan the module.
3. Wait for approval.
4. Implement one module.
5. Add and run tests.
6. Refactor and self-review.
7. Update documentation.
8. Commit after validation.
9. Stop for review before continuing.

The project must not be generated in one pass.

## Current Status

- Module 1: Project foundation and documentation baseline.
- Application features: not started.
- Migration target behavior: pending source application analysis.

## Documentation

- [Project Plan](docs/project-plan.md)
- [Module 1 Foundation](docs/module-1-foundation.md)
- [Module 2 Workspace & Tooling](docs/module-2-workspace-tooling.md)
- [Module 3 Backend API Foundation](docs/module-3-backend-api-foundation.md)
- [Module 4 Parser Foundation](docs/module-4-parser-foundation.md)
- [Module 5 AI Retrieval Foundation](docs/module-5-ai-retrieval-foundation.md)
- [Module 6 Frontend Foundation](docs/module-6-frontend-foundation.md)
- [Architecture](docs/architecture.md)
- [Migration Workflow](docs/migration-workflow.md)
- [Testing Strategy](docs/testing-strategy.md)
- [API Guidelines](docs/api-guidelines.md)
- [Design Decisions](docs/decisions/0001-project-foundation.md)

## Local Development

Module 6 can be validated without installing dependencies:

```bash
npm.cmd run validate
```

Run the backend shell:

```bash
npm.cmd run dev:backend
```

Run the frontend shell:

```bash
npm.cmd run dev:frontend
```

The frontend listens on `http://127.0.0.1:3000` by default.

The backend listens on `http://127.0.0.1:4000` by default.

Run both services together:

```bash
npm.cmd run dev
```

Available endpoints:

- `GET /health`
- `GET /api/v1/health`
- `GET /ready`
- `GET /api/v1/ready`

After pnpm is installed, use the workspace commands:

```bash
pnpm install
pnpm validate
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```
