# parser

Owns repository inspection and static analysis.

Planned responsibilities:

- File discovery.
- Language detection.
- Source chunking.
- Symbol and dependency extraction.
- Parser contracts for language-specific analyzers.

Module 4 adds the first parser foundation:

- Source file discovery with generated-folder ignores.
- Filename and extension-based language detection.
- Source artifact creation for downstream analyzers.
- Parser adapter contracts for future language-specific implementations.
