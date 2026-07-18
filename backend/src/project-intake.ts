import { realpath, stat } from "node:fs/promises";
import {
  defaultDiscoveryOptions,
  discoverSourceFiles,
  type DiscoveredSourceFile,
} from "../../parser/src/index.ts";
import { BackendError } from "./errors.ts";

export type ProjectIntakeRequest = {
  readonly projectName: string;
  readonly sourcePath: string;
  readonly maxFiles?: number;
  readonly maxFileSizeBytes?: number;
};

export type ProjectIntake = {
  readonly projectName: string;
  readonly sourcePath: string;
  readonly realSourcePath: string;
  readonly maxFiles: number;
  readonly maxFileSizeBytes: number;
};

export type ProjectIntakePreview = ProjectIntake & {
  readonly fileCount: number;
  readonly previewFileCount: number;
  readonly languages: readonly {
    readonly language: string;
    readonly fileCount: number;
  }[];
  readonly previewFiles: readonly {
    readonly path: string;
    readonly language: string;
    readonly sizeBytes: number;
  }[];
};

export async function validateProjectIntake(
  request: ProjectIntakeRequest,
): Promise<ProjectIntake> {
  const projectName = request.projectName.trim();
  const sourcePath = request.sourcePath.trim();
  const maxFiles = request.maxFiles ?? 50;
  const maxFileSizeBytes =
    request.maxFileSizeBytes ?? defaultDiscoveryOptions.maxFileSizeBytes;

  if (projectName.length === 0) {
    throw new BackendError("INVALID_PROJECT_NAME", "Project name is required.", {
      statusCode: 400,
    });
  }

  if (sourcePath.length === 0) {
    throw new BackendError("INVALID_SOURCE_PATH", "Source path is required.", {
      statusCode: 400,
    });
  }

  if (!Number.isInteger(maxFiles) || maxFiles < 1 || maxFiles > 500) {
    throw new BackendError("INVALID_MAX_FILES", "maxFiles must be from 1 to 500.", {
      statusCode: 400,
      details: { maxFiles },
    });
  }

  if (
    !Number.isInteger(maxFileSizeBytes) ||
    maxFileSizeBytes < 1 ||
    maxFileSizeBytes > 10 * 1024 * 1024
  ) {
    throw new BackendError(
      "INVALID_MAX_FILE_SIZE",
      "maxFileSizeBytes must be from 1 byte to 10 MB.",
      {
        statusCode: 400,
        details: { maxFileSizeBytes },
      },
    );
  }

  const realSourcePath = await resolveDirectory(sourcePath);

  return {
    projectName,
    sourcePath,
    realSourcePath,
    maxFiles,
    maxFileSizeBytes,
  };
}

export async function previewProjectIntake(
  request: ProjectIntakeRequest,
): Promise<ProjectIntakePreview> {
  const intake = await validateProjectIntake(request);
  const files = await discoverIntakeFiles(intake);

  return {
    ...intake,
    fileCount: files.length,
    previewFileCount: Math.min(files.length, intake.maxFiles),
    languages: summarizeLanguages(files),
    previewFiles: files.slice(0, intake.maxFiles).map((file) => ({
      path: file.relativePath,
      language: file.language,
      sizeBytes: file.sizeBytes,
    })),
  };
}

export async function discoverIntakeFiles(
  intake: ProjectIntake,
): Promise<readonly DiscoveredSourceFile[]> {
  return discoverSourceFiles(intake.realSourcePath, {
    maxFileSizeBytes: intake.maxFileSizeBytes,
  });
}

async function resolveDirectory(sourcePath: string): Promise<string> {
  try {
    const resolvedPath = await realpath(sourcePath);
    const sourceStat = await stat(resolvedPath);

    if (!sourceStat.isDirectory()) {
      throw new BackendError("SOURCE_PATH_NOT_DIRECTORY", "Source path must be a directory.", {
        statusCode: 400,
        details: { sourcePath },
      });
    }

    return resolvedPath;
  } catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }

    throw new BackendError("SOURCE_PATH_NOT_FOUND", "Source path was not found.", {
      statusCode: 400,
      details: { sourcePath },
    });
  }
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
