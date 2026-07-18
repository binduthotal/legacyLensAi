# Module 9: Repository Upload and File Intake

## Objective

Make the project intake flow safer and more explicit before adding real upload
or Git provider integrations.

## Scope

- Validate project intake requests.
- Resolve and verify local source directories.
- Enforce `maxFiles` from 1 to 500.
- Enforce `maxFileSizeBytes` from 1 byte to 10 MB.
- Add `POST /api/v1/projects/intake/preview`.
- Apply intake limits to project analysis.
- Add frontend controls for file count and file size.
- Show project detail from the persisted registry.

## API

### Intake Preview

```http
POST /api/v1/projects/intake/preview
content-type: application/json
```

```json
{
  "projectName": "Legacy Billing",
  "sourcePath": "D:\\projects\\legacy-billing",
  "maxFiles": 50,
  "maxFileSizeBytes": 1048576
}
```

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run test
npm.cmd run build
```

## Non-Goals

- No ZIP upload yet.
- No Git provider integration.
- No binary file parsing.
- No authentication or authorization.

## Next Recommended Module

Module 10: Project Detail and Source Inventory UI

Suggested scope:

- Add a project detail view.
- Display analyzed file inventory.
- Display language breakdown.
- Add source chunk preview with citations.
- Add focused frontend and integration tests.
