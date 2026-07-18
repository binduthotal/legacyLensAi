# API Guidelines

## Principles

- APIs must be explicit and versionable.
- Responses must be typed.
- Errors must be structured and actionable.
- Long-running operations must use jobs.
- AI-generated answers must include source references when based on repository content.

## Planned API Areas

- Projects
- Ingestion jobs
- File inventory
- Static analysis results
- Knowledge index status
- AI assistant conversations
- Migration plans
- Reports

## Implemented API Routes

### Project Analysis

```http
POST /api/v1/projects/analyze
```

Creates an in-memory analysis preview for a local source path. The route
discovers source files, creates parser artifacts, converts them into AI
knowledge chunk metadata, persists the summary to the project registry, and
returns the resulting project record.

### Project Intake Preview

```http
POST /api/v1/projects/intake/preview
```

Validates a local source path, applies file count and file size limits, and
returns a preview of the files that would be analyzed.

### Project Registry

```http
GET /api/v1/projects
GET /api/v1/projects/:projectId
```

Returns persisted project analysis records from the local registry.

## Error Shape

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project was not found.",
    "details": {}
  }
}
```

## Versioning

Initial APIs should use `/api/v1`. Breaking changes require either versioning or an explicit migration path.
