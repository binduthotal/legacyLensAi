import type { RetrievalResult } from "./retrieval.ts";

export const sourceGroundingSystemPrompt =
  "Answer only from the supplied source context. If the context is insufficient, say what is missing. Preserve existing business behavior and cite the relevant source labels.";

export type GroundedAnswerPrompt = {
  readonly system: string;
  readonly user: string;
  readonly citations: readonly string[];
};

export function createGroundedAnswerPrompt(input: {
  readonly question: string;
  readonly results: readonly RetrievalResult[];
}): GroundedAnswerPrompt {
  const question = input.question.trim();

  if (question.length === 0) {
    throw new Error("Prompt question cannot be empty.");
  }

  const contextBlocks = input.results.map((result, index) => {
    return [
      `[Source ${index + 1}: ${result.citation.label}]`,
      result.chunk.content,
    ].join("\n");
  });

  return {
    system: sourceGroundingSystemPrompt,
    user: [`Question: ${question}`, "Source context:", ...contextBlocks].join("\n\n"),
    citations: input.results.map((result) => result.citation.label),
  };
}
