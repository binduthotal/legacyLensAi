# ADR 0004: Parser Foundation

## Status

Accepted

## Context

LegacyLens AI needs a parser boundary before AI retrieval can safely reason over
source files. The current environment is intentionally dependency-free, so the
first parser module must avoid external parsing libraries while still defining
stable contracts.

## Decision

Implement source discovery, language detection, source artifact creation, and
parser adapter contracts using Node built-ins only. Defer Tree-sitter and
language-specific analysis until later modules.

## Consequences

- Future modules have stable parser contracts to build on.
- The platform can index basic file metadata before deep parsing exists.
- Generated and dependency directories are ignored by default.
- Deep symbol and dependency extraction remain explicit future work.
