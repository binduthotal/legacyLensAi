# Module 10: Project Detail and Source Inventory UI

## Objective

Make analyzed projects inspectable in the frontend by showing project details,
language breakdown, file inventory, and source chunk citation previews.

## Scope

- Project detail rendering in the frontend.
- Language breakdown panel.
- Source chunk citation preview.
- File inventory table.
- Safer HTML rendering for project and file values.
- Frontend tests for the new detail UI.

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run test
npm.cmd run build
```

## Non-Goals

- No full source file viewer yet.
- No AI question-answering UI yet.
- No charting library integration.
- No frontend framework migration.

## Next Recommended Module

Module 11: Source File Viewer and Citation Navigation

Suggested scope:

- Add project file detail endpoint.
- Persist or reconstruct source excerpts for selected files.
- Add frontend file selection.
- Show source excerpts and citation anchors.
