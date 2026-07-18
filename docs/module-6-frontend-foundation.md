# Module 6: Frontend Foundation

## Objective

Create the first runnable frontend shell for LegacyLens AI without introducing
framework dependencies yet.

## Scope

- Static workspace shell.
- Navigation for overview, projects, analysis, knowledge, and reports.
- Project intake form for analysis planning.
- Backend health status indicator.
- Dependency-free static server.
- Frontend tests for configuration, routing, and required UI sections.

## Run Locally

Start the backend:

```bash
npm.cmd run dev
```

Start the frontend:

```bash
node frontend/src/main.ts
```

Open:

```text
http://127.0.0.1:3000
```

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run test
npm.cmd run build
```

## Non-Goals

- No Next.js or React runtime yet.
- No real project persistence.
- No repository upload.
- No parser or AI orchestration from the UI.

## Next Recommended Module

Module 7: End-to-End MVP Flow

Suggested scope:

- Add an API route that accepts a local project path.
- Use parser source discovery to produce file inventory.
- Convert artifacts into AI knowledge chunks.
- Return a basic source-grounded project summary payload.
- Add integration tests across backend, parser, and AI contracts.
