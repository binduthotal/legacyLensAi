import {
  createGroundedAnswerPrompt,
  createKnowledgeChunk,
  createRetrievalQuery,
  rankRetrievedChunks,
  type RetrievalResult,
} from "../../ai/src/index.ts";
import { BackendError } from "./errors.ts";
import type { ProjectRecord } from "./project-registry.ts";
import { readProjectSourceFile } from "./source-file.ts";

export type ProjectQuestionRequest = {
  readonly question: string;
  readonly maxResults?: number;
};

export type ProjectQuestionAnswer = {
  readonly projectId: string;
  readonly question: string;
  readonly answer: string;
  readonly citations: readonly string[];
  readonly confidence: "source-grounded" | "insufficient-context";
  readonly promptPreview: {
    readonly system: string;
    readonly citations: readonly string[];
  };
};

export async function answerProjectQuestion(
  project: ProjectRecord,
  request: ProjectQuestionRequest,
): Promise<ProjectQuestionAnswer> {
  const query = createRetrievalQuery({
    projectId: project.id,
    question: request.question,
    maxResults: request.maxResults,
  });
  const chunks = await Promise.all(
    project.knowledgeChunks.map(async (chunk) => {
      const file = await readProjectSourceFile(project, chunk.source.path);
      return createKnowledgeChunk({
        id: chunk.id,
        projectId: project.id,
        content: file.content,
        source: chunk.source,
        language: chunk.language,
        metadata: {
          sourcePath: project.sourcePath,
        },
      });
    }),
  );
  const scoredResults = rankRetrievedChunks(chunks, scoreChunks(query.question, chunks));
  const results = scoredResults
    .filter((result) => result.score > 0)
    .slice(0, query.maxResults);
  const prompt = createGroundedAnswerPrompt({
    question: query.question,
    results,
  });

  if (results.length === 0) {
    return {
      projectId: project.id,
      question: query.question,
      answer:
        "I do not have enough source evidence in the analyzed project chunks to answer this question.",
      citations: [],
      confidence: "insufficient-context",
      promptPreview: {
        system: prompt.system,
        citations: prompt.citations,
      },
    };
  }

  return {
    projectId: project.id,
    question: query.question,
    answer: summarizeResults(results),
    citations: prompt.citations,
    confidence: "source-grounded",
    promptPreview: {
      system: prompt.system,
      citations: prompt.citations,
    },
  };
}

export function parseProjectQuestionRequest(body: unknown): ProjectQuestionRequest {
  if (!isRecord(body)) {
    throw new BackendError("INVALID_REQUEST_BODY", "Request body must be an object.", {
      statusCode: 400,
    });
  }

  if (typeof body.question !== "string" || body.question.trim().length === 0) {
    throw new BackendError("INVALID_PROJECT_QUESTION", "question must be a string.", {
      statusCode: 400,
    });
  }

  if (
    body.maxResults !== undefined &&
    (!Number.isInteger(body.maxResults) || body.maxResults < 1 || body.maxResults > 10)
  ) {
    throw new BackendError(
      "INVALID_PROJECT_QUESTION_LIMIT",
      "maxResults must be an integer from 1 to 10.",
      {
        statusCode: 400,
      },
    );
  }

  return {
    question: body.question,
    maxResults: body.maxResults,
  };
}

function scoreChunks(
  question: string,
  chunks: readonly ReturnType<typeof createKnowledgeChunk>[],
): ReadonlyMap<string, number> {
  const terms = tokenize(question);
  const scores = new Map<string, number>();

  for (const chunk of chunks) {
    const searchable = `${chunk.source.path} ${chunk.language} ${chunk.content}`;
    const text = searchable.toLowerCase();
    const score = terms.reduce((total, term) => {
      return total + countOccurrences(text, term);
    }, 0);

    scores.set(chunk.id, score);
  }

  return scores;
}

function summarizeResults(results: readonly RetrievalResult[]): string {
  const evidence = results
    .map((result) => {
      const excerpt = compact(result.chunk.content).slice(0, 220);
      return `${excerpt} [${result.citation.label}]`;
    })
    .join(" ");

  return `Based on the analyzed source, ${evidence}`;
}

function tokenize(value: string): readonly string[] {
  return [
    ...new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9_]+/g)
        .map((term) => term.trim())
        .filter((term) => term.length >= 3),
    ),
  ];
}

function countOccurrences(value: string, term: string): number {
  return value.split(term).length - 1;
}

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
