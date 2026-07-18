# Project Plan

## Objective

Build an AI-powered legacy code knowledge transfer platform that helps teams
understand, document, and migrate enterprise applications while preserving
existing behavior.

## Product Capabilities

### MVP

- Ingest a legacy source repository or sample project.
- Detect project structure, languages, dependencies, and entry points.
- Parse and chunk source files for retrieval.
- Generate architecture and module summaries with source references.
- Provide a source-grounded AI question-answering experience.
- Produce migration notes and onboarding documentation.

### Post-MVP

- Git provider integrations.
- Incremental indexing.
- Dependency and call-flow visualizations.
- Business-rule extraction.
- API and workflow comparison between original and migrated systems.
- Team knowledge base and role-based access.

## Module Roadmap

### Module 1: Project Foundation

- Establish repository structure.
- Document architecture and delivery rules.
- Add baseline tooling configuration.
- Define testing, API, and migration workflows.

### Module 2: Project Workspace & Tooling

- Convert placeholders into TypeScript package shells.
- Add lint, format, and test tooling.
- Add CI-ready scripts.
- Add basic validation commands without introducing product behavior.
- Status: completed.

### Module 3: Backend API Foundation

- Create backend service skeleton.
- Add health checks, configuration loading, logging, and error handling.
- Add unit tests for configuration and API health behavior.
- Status: completed.

### Module 4: Parser Foundation

- Add source discovery and language detection.
- Define parser interfaces.
- Add fixtures and tests using sample projects.
- Status: completed.

### Module 5: AI Retrieval Foundation

- Define embedding and retrieval interfaces.
- Add prompt boundaries and citation requirements.
- Add tests for retrieval contracts.
- Status: completed.

### Module 6: Frontend Foundation

- Create the web application shell.
- Add project upload/indexing views.
- Add layout, navigation, and basic state management.
- Status: completed.

### Module 7: End-to-End MVP Flow

- Connect ingestion, parsing, indexing, and question answering.
- Add integration tests and workflow validation.
- Status: completed.

### Module 8: Persistence and Project Registry

- Persist project analysis summaries.
- Add project list and detail API routes.
- Show analyzed projects in the frontend.
- Add registry integration tests.
- Status: completed.

## Delivery Rules

- Implement one module at a time.
- Stop for review after each module.
- Preserve source behavior during migrations.
- Update documentation continuously.
- Commit only validated module work.
