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
