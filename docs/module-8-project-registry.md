# Module 8: Persistence and Project Registry

## Objective

Persist project analysis summaries and expose them through project registry
APIs so analyzed projects can be listed and reopened.

## Scope

- File-backed project registry.
- Backend registry config through `PROJECT_REGISTRY_FILE`.
- Persist `POST /api/v1/projects/analyze` results.
- Add `GET /api/v1/projects`.
- Add `GET /api/v1/projects/:projectId`.
- Show analyzed projects in the frontend shell.
- Add integration tests for persistence and registry routes.

## Storage

The default registry file is:

```text
.legacylens/project-registry.json
```

This path is ignored by Git because it is local runtime state.

## API

### List Projects

```http
GET /api/v1/projects
```

### Get Project

```http
GET /api/v1/projects/:projectId
```

### Analyze and Persist Project

```http
POST /api/v1/projects/analyze
```

The analysis route now returns a persisted `ProjectRecord` with:

- `id`
- `projectId`
- `createdAt`
- `updatedAt`
- analysis summary fields

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run test
npm.cmd run build
```

## Non-Goals

- No PostgreSQL or Prisma integration yet.
- No authentication or project ownership.
- No vector persistence.
- No repository upload persistence.

## Next Recommended Module

Module 9: Repository Upload and File Intake

Suggested scope:

- Add upload/intake contracts.
- Support project analysis from a registered local path or uploaded fixture.
- Add safer path validation and size limits.
- Improve frontend project detail display.
