# Module 12: AI Question Answering UI

## Objective

Let users ask source-grounded questions about an analyzed project and receive
answers with citations.

## Scope

- Add `POST /api/v1/projects/:projectId/questions`.
- Validate question payloads and result limits.
- Reconstruct source-grounded chunks from the persisted project inventory.
- Rank chunks with deterministic lexical scoring.
- Return answers with citation labels and confidence status.
- Add frontend Q&A form for the selected project.
- Add route and frontend tests.

## API

```http
POST /api/v1/projects/legacy-billing/questions
Content-Type: application/json

{
  "question": "How are invoices approved?",
  "maxResults": 3
}
```

Returns:

```json
{
  "projectId": "legacy-billing",
  "question": "How are invoices approved?",
  "answer": "Based on the analyzed source, ... [README.md:1-4]",
  "citations": ["README.md:1-4"],
  "confidence": "source-grounded",
  "promptPreview": {
    "system": "Answer only from the supplied source context...",
    "citations": ["README.md:1-4"]
  }
}
```

## Impact Analysis

- Existing analysis, registry, source viewer, and health routes are unchanged.
- The endpoint only reads files already listed in the analyzed project record.
- No external AI provider is required in this module.
- The deterministic ranking is an MVP stand-in for vector retrieval and model
  generation in later tooling upgrades.

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run test
npm.cmd run build
```

## Non-Goals

- No external model call.
- No streaming answer UI.
- No chat history persistence.
- No semantic embeddings yet.

## Remaining MVP Modules

After Module 12, the recommended MVP roadmap has 3 modules remaining:

1. Module 13: Migration Report Generation
2. Module 14: Dependency Installation and Real Tooling Upgrade
3. Module 15: Final Integration Hardening and Release Notes
