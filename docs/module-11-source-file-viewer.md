# Module 11: Source File Viewer and Citation Navigation

## Objective

Let users open analyzed source files from the project inventory and view source
content with citation labels.

## Scope

- Add `GET /api/v1/projects/:projectId/files?path=...`.
- Read source file content from the registered project path.
- Restrict reads to files already present in the analyzed inventory.
- Reject traversal paths.
- Add frontend file inventory links.
- Add source viewer and citation display.
- Add tests for source file loading and path rejection.

## API

```http
GET /api/v1/projects/:projectId/files?path=src%2Fexample.ts
```

Returns:

```json
{
  "projectId": "legacy-billing",
  "path": "src/example.ts",
  "language": "typescript",
  "sizeBytes": 100,
  "lineCount": 5,
  "content": "source text",
  "citationLabel": "src/example.ts:1-5"
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

- No syntax highlighting library.
- No editable source view.
- No deep symbol navigation yet.
- No AI chat over selected source yet.

## Remaining MVP Modules

After Module 11, the recommended MVP roadmap has 4 modules remaining:

1. Module 12: AI Question Answering UI
2. Module 13: Migration Report Generation
3. Module 14: Dependency Installation and Real Tooling Upgrade
4. Module 15: Final Integration Hardening and Release Notes
