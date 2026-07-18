import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { BackendError } from "./errors.ts";
import type { ProjectRecord } from "./project-registry.ts";

export type SourceFileDetail = {
  readonly projectId: string;
  readonly path: string;
  readonly language: string;
  readonly sizeBytes: number;
  readonly lineCount: number;
  readonly content: string;
  readonly citationLabel: string;
};

export async function readProjectSourceFile(
  project: ProjectRecord,
  requestedPath: string | undefined,
): Promise<SourceFileDetail> {
  if (!requestedPath || requestedPath.trim().length === 0) {
    throw new BackendError("INVALID_SOURCE_FILE_PATH", "File path is required.", {
      statusCode: 400,
    });
  }

  const normalizedPath = normalizeRelativePath(requestedPath);
  const file = project.files.find((candidate) => candidate.path === normalizedPath);

  if (!file) {
    throw new BackendError("SOURCE_FILE_NOT_FOUND", "Source file was not found.", {
      statusCode: 404,
      details: {
        projectId: project.id,
        path: normalizedPath,
      },
    });
  }

  const projectRoot = resolve(project.sourcePath);
  const absolutePath = resolve(projectRoot, normalizedPath);

  if (!absolutePath.startsWith(`${projectRoot}${sep}`) && absolutePath !== projectRoot) {
    throw new BackendError("SOURCE_FILE_OUTSIDE_PROJECT", "File path is outside the project.", {
      statusCode: 400,
      details: {
        path: normalizedPath,
      },
    });
  }

  const content = await readFile(absolutePath, "utf8");

  return {
    projectId: project.id,
    path: file.path,
    language: file.language,
    sizeBytes: file.sizeBytes,
    lineCount: file.lineCount,
    content,
    citationLabel: `${file.path}:1-${file.lineCount}`,
  };
}

function normalizeRelativePath(path: string): string {
  const normalized = path.replaceAll("\\", "/").replace(/^\/+/, "");

  if (normalized.includes("../") || normalized === "..") {
    throw new BackendError(
      "INVALID_SOURCE_FILE_PATH",
      "File path must stay inside the project.",
      {
        statusCode: 400,
        details: { path },
      },
    );
  }

  return normalized;
}
