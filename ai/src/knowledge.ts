export type SourceLocation = {
  readonly path: string;
  readonly startLine?: number;
  readonly endLine?: number;
};

export type Citation = {
  readonly source: SourceLocation;
  readonly label: string;
};

export type KnowledgeChunk = {
  readonly id: string;
  readonly projectId: string;
  readonly content: string;
  readonly source: SourceLocation;
  readonly language: string;
  readonly tokenEstimate: number;
  readonly metadata: Record<string, string>;
};

export function createKnowledgeChunk(input: {
  readonly id: string;
  readonly projectId: string;
  readonly content: string;
  readonly source: SourceLocation;
  readonly language: string;
  readonly metadata?: Record<string, string>;
}): KnowledgeChunk {
  const content = input.content.trim();

  if (content.length === 0) {
    throw new Error("Knowledge chunk content cannot be empty.");
  }

  return {
    id: input.id,
    projectId: input.projectId,
    content,
    source: input.source,
    language: input.language,
    tokenEstimate: estimateTokens(content),
    metadata: input.metadata ?? {},
  };
}

function estimateTokens(content: string): number {
  return Math.max(1, Math.ceil(content.length / 4));
}
