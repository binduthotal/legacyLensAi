import { createKnowledgeChunk, type KnowledgeChunk } from "../../ai/src/index.ts";
import {
  createSourceArtifact,
  type DiscoveredSourceFile,
} from "../../parser/src/index.ts";
import { BackendError } from "./errors.ts";
import {
  discoverIntakeFiles,
  validateProjectIntake,
  type ProjectIntakeRequest,
} from "./project-intake.ts";

export type ProjectAnalysisRequest = ProjectIntakeRequest;

export type ProjectAnalysisSummary = {
  readonly projectId: string;
  readonly projectName: string;
  readonly sourcePath: string;
  readonly fileCount: number;
  readonly analyzedFileCount: number;
  readonly languages: readonly {
    readonly language: string;
    readonly fileCount: number;
  }[];
  readonly files: readonly {
    readonly path: string;
    readonly language: string;
    readonly sizeBytes: number;
    readonly lineCount: number;
  }[];
  readonly knowledgeChunks: readonly Pick<
    KnowledgeChunk,
    "id" | "projectId" | "source" | "language" | "tokenEstimate"
  >[];
};

export async function analyzeProject(
  request: ProjectAnalysisRequest,
): Promise<ProjectAnalysisSummary> {
  const intake = await validateProjectIntake(request);
  const discoveredFiles = await discoverIntakeFiles(intake);
  const selectedFiles = discoveredFiles.slice(0, intake.maxFiles);
  const artifacts = await Promise.all(selectedFiles.map(createSourceArtifact));
  const projectId = slugify(intake.projectName);

  const knowledgeChunks = artifacts.map((artifact, index) =>
    createKnowledgeChunk({
      id: `${projectId}:${index + 1}`,
      projectId,
      content: artifact.content,
      source: {
        path: artifact.path,
        startLine: artifact.lineCount > 0 ? 1 : undefined,
        endLine: artifact.lineCount > 0 ? artifact.lineCount : undefined,
      },
      language: artifact.language,
      metadata: {
        sourcePath: intake.realSourcePath,
      },
    }),
  );

  return {
    projectId,
    projectName: intake.projectName,
    sourcePath: intake.realSourcePath,
    fileCount: discoveredFiles.length,
    analyzedFileCount: artifacts.length,
    languages: summarizeLanguages(discoveredFiles),
    files: artifacts.map((artifact) => ({
      path: artifact.path,
      language: artifact.language,
      sizeBytes: artifact.sizeBytes,
      lineCount: artifact.lineCount,
    })),
    knowledgeChunks: knowledgeChunks.map((chunk) => ({
      id: chunk.id,
      projectId: chunk.projectId,
      source: chunk.source,
      language: chunk.language,
      tokenEstimate: chunk.tokenEstimate,
    })),
  };
}

export function parseProjectAnalysisRequest(body: unknown): ProjectAnalysisRequest {
  if (!isRecord(body)) {
    throw new BackendError("INVALID_REQUEST_BODY", "Request body must be an object.", {
      statusCode: 400,
    });
  }

  if (typeof body.projectName !== "string") {
    throw new BackendError("INVALID_PROJECT_NAME", "projectName must be a string.", {
      statusCode: 400,
    });
  }

  if (typeof body.sourcePath !== "string") {
    throw new BackendError("INVALID_SOURCE_PATH", "sourcePath must be a string.", {
      statusCode: 400,
    });
  }

  if (body.maxFiles !== undefined && typeof body.maxFiles !== "number") {
    throw new BackendError("INVALID_MAX_FILES", "maxFiles must be a number.", {
      statusCode: 400,
    });
  }

  if (
    body.maxFileSizeBytes !== undefined &&
    typeof body.maxFileSizeBytes !== "number"
  ) {
    throw new BackendError(
      "INVALID_MAX_FILE_SIZE",
      "maxFileSizeBytes must be a number.",
      {
        statusCode: 400,
      },
    );
  }

  return {
    projectName: body.projectName,
    sourcePath: body.sourcePath,
    maxFiles: body.maxFiles,
    maxFileSizeBytes: body.maxFileSizeBytes,
  };
}

function summarizeLanguages(files: readonly DiscoveredSourceFile[]) {
  const counts = new Map<string, number>();

  for (const file of files) {
    counts.set(file.language, (counts.get(file.language) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([language, fileCount]) => ({ language, fileCount }))
    .sort((left, right) => left.language.localeCompare(right.language));
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "project";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
