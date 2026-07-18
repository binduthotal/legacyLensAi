export {
  createEmbeddingRequest,
  type EmbeddingProvider,
  type EmbeddingRequest,
  type EmbeddingResult,
} from "./embedding.ts";
export {
  createKnowledgeChunk,
  type Citation,
  type KnowledgeChunk,
  type SourceLocation,
} from "./knowledge.ts";
export {
  createGroundedAnswerPrompt,
  sourceGroundingSystemPrompt,
  type GroundedAnswerPrompt,
} from "./prompts.ts";
export {
  createRetrievalQuery,
  rankRetrievedChunks,
  type RetrievalQuery,
  type RetrievalResult,
  type Retriever,
} from "./retrieval.ts";

export const aiPackage = {
  name: "@legacylens/ai",
  responsibility: "source-grounded-ai-shell",
} as const;
