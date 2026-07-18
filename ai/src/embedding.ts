import type { KnowledgeChunk } from "./knowledge.ts";

export type EmbeddingRequest = {
  readonly chunkId: string;
  readonly projectId: string;
  readonly input: string;
  readonly sourcePath: string;
};

export type EmbeddingResult = {
  readonly chunkId: string;
  readonly vector: readonly number[];
};

export type EmbeddingProvider = {
  embed(request: EmbeddingRequest): Promise<EmbeddingResult>;
};

export function createEmbeddingRequest(chunk: KnowledgeChunk): EmbeddingRequest {
  return {
    chunkId: chunk.id,
    projectId: chunk.projectId,
    input: chunk.content,
    sourcePath: chunk.source.path,
  };
}
