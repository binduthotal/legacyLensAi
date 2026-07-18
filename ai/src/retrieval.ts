import type { Citation, KnowledgeChunk } from "./knowledge.ts";

export type RetrievalQuery = {
  readonly projectId: string;
  readonly question: string;
  readonly maxResults: number;
};

export type RetrievalResult = {
  readonly chunk: KnowledgeChunk;
  readonly score: number;
  readonly citation: Citation;
};

export type Retriever = {
  retrieve(query: RetrievalQuery): Promise<readonly RetrievalResult[]>;
};

export function createRetrievalQuery(input: {
  readonly projectId: string;
  readonly question: string;
  readonly maxResults?: number;
}): RetrievalQuery {
  const question = input.question.trim();

  if (question.length === 0) {
    throw new Error("Retrieval question cannot be empty.");
  }

  return {
    projectId: input.projectId,
    question,
    maxResults: input.maxResults ?? 5,
  };
}

export function rankRetrievedChunks(
  chunks: readonly KnowledgeChunk[],
  scores: ReadonlyMap<string, number>,
): readonly RetrievalResult[] {
  return chunks
    .map((chunk) => ({
      chunk,
      score: scores.get(chunk.id) ?? 0,
      citation: {
        source: chunk.source,
        label: formatCitationLabel(chunk),
      },
    }))
    .sort((left, right) => right.score - left.score);
}

function formatCitationLabel(chunk: KnowledgeChunk): string {
  const { path, startLine, endLine } = chunk.source;

  if (startLine && endLine && startLine !== endLine) {
    return `${path}:${startLine}-${endLine}`;
  }

  if (startLine) {
    return `${path}:${startLine}`;
  }

  return path;
}
