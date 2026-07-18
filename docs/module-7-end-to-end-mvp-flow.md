# Module 7: End-to-End MVP Flow

## Objective

Connect the existing backend, parser, and AI contracts into the first
end-to-end analysis flow.

## Scope

- Add a backend project analysis service.
- Add `POST /api/v1/projects/analyze`.
- Parse JSON request bodies.
- Discover files with the parser package.
- Create source artifacts.
- Convert artifacts into AI knowledge chunk metadata.
- Return a basic project inventory and source-grounded analysis payload.
- Submit the frontend project intake form to the backend analysis route.
- Add integration tests across backend, parser, and AI contracts.

## API

### Request

```http
POST /api/v1/projects/analyze
content-type: application/json
```

```json
{
  "projectName": "Legacy Billing",
  "sourcePath": "D:\\projects\\legacy-billing",
  "maxFiles": 25
}
```

### Response

```json
{
  "projectName": "Legacy Billing",
  "sourcePath": "D:\\projects\\legacy-billing",
  "fileCount": 3,
  "analyzedFileCount": 3,
  "languages": [
    {
      "language": "typescript",
      "fileCount": 1
    }
  ],
  "files": [
    {
      "path": "src/billing.ts",
      "language": "typescript",
      "sizeBytes": 81,
      "lineCount": 3
    }
  ],
  "knowledgeChunks": [
    {
      "id": "legacy-billing:1",
      "projectId": "legacy-billing",
      "source": {
        "path": "src/billing.ts",
        "startLine": 1,
        "endLine": 3
      },
      "language": "typescript",
      "tokenEstimate": 21
    }
  ]
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

- No persistence.
- No embeddings generated against a live provider.
- No vector database writes.
- No natural-language answer generation endpoint.
- No repository upload yet.

## Next Recommended Module

Module 8: Persistence and Project Registry

Suggested scope:

- Add project registry contracts.
- Persist analysis summaries to local JSON storage or a database adapter
  contract.
- Add project list/detail API routes.
- Update the frontend to display analyzed projects.
