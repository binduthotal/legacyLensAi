# Module 4: Parser Foundation

## Objective

Create the first parser foundation for discovering source files, detecting
languages, and producing source artifacts that future analyzers can consume.

## Scope

- Source discovery from a project root.
- Default ignores for generated and dependency directories.
- Language detection by filename and extension.
- Source artifact creation with content, line count, size, path, and language.
- Parser adapter contracts for future language-specific implementations.
- Tests using a generated sample project fixture.

## Public Parser API

The parser package exports:

- `discoverSourceFiles`
- `detectLanguage`
- `createSourceArtifact`
- `ParserAdapter`
- `SourceArtifact`
- `SourceParserContext`

## Default Ignore Directories

- `.git`
- `.next`
- `build`
- `coverage`
- `dist`
- `node_modules`
- `out`
- `target`

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run test
npm.cmd run build
```

## Non-Goals

- No Tree-sitter integration yet.
- No dependency graph extraction yet.
- No symbol extraction yet.
- No AI summarization or embedding.

## Next Recommended Module

Module 5: AI Retrieval Foundation

Suggested scope:

- Define embedding contracts.
- Define retrieval contracts.
- Add prompt boundaries and citation rules.
- Add tests for source-grounded retrieval payloads.
