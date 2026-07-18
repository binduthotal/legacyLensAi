# ai

Owns AI-provider adapters, prompts, retrieval orchestration, citations,
evaluation, and source-grounded answer generation.

Planned responsibilities:

- Embedding generation.
- Prompt templates and guardrails.
- Retrieval-augmented generation.
- Source citation enforcement.
- AI evaluation fixtures and scoring.

Module 5 adds the first AI retrieval foundation:

- Provider-neutral embedding request contracts.
- Knowledge chunk and citation models.
- Retrieval query and ranking contracts.
- Source-grounded prompt construction.

No external model provider is called in this module.
