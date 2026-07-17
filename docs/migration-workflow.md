# Migration Workflow

## Required Process

1. Analyze the entire source application before coding.
2. Document architecture, dependencies, configuration, workflows, and business
   rules.
3. Identify module boundaries and migration order.
4. Perform dependency and impact analysis for the next module.
5. Plan the module and wait for approval.
6. Implement the approved module only.
7. Preserve algorithms and observable behavior.
8. Add unit tests and relevant integration tests.
9. Run tests, fix failures, and re-run.
10. Refactor and self-review.
11. Update documentation and migration notes.
12. Commit the validated module.
13. Stop for review.

## Behavior Preservation Checklist

- Inputs and outputs match the original behavior.
- Validation rules match the original behavior.
- Error cases match the original behavior.
- State transitions match the original behavior.
- User workflows match the original behavior.
- API contracts match the original behavior.
- Performance is measured where behavior depends on timing or throughput.

## Migration Notes Template

For each migrated module, document:

- Original source files.
- Target files.
- Preserved business rules.
- Preserved algorithms.
- Intentional changes, if any.
- Test coverage.
- Known risks.
- Review outcome.
