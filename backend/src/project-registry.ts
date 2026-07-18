import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { BackendError } from "./errors.ts";
import type { ProjectAnalysisSummary } from "./project-analysis.ts";

export type ProjectRecord = ProjectAnalysisSummary & {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ProjectRegistrySnapshot = {
  readonly projects: readonly ProjectRecord[];
};

export type ProjectRegistry = {
  save(summary: ProjectAnalysisSummary): Promise<ProjectRecord>;
  list(): Promise<readonly ProjectRecord[]>;
  get(projectId: string): Promise<ProjectRecord>;
};

export function createFileProjectRegistry(filePath: string): ProjectRegistry {
  const resolvedFilePath = resolve(filePath);

  return {
    async save(summary) {
      const snapshot = await readSnapshot(resolvedFilePath);
      const now = new Date().toISOString();
      const existing = snapshot.projects.find(
        (project) => project.id === summary.projectId,
      );
      const record: ProjectRecord = {
        ...summary,
        id: summary.projectId,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      const projects = [
        record,
        ...snapshot.projects.filter((project) => project.id !== record.id),
      ];

      await writeSnapshot(resolvedFilePath, { projects });
      return record;
    },

    async list() {
      const snapshot = await readSnapshot(resolvedFilePath);
      return snapshot.projects;
    },

    async get(projectId) {
      const snapshot = await readSnapshot(resolvedFilePath);
      const project = snapshot.projects.find((record) => record.id === projectId);

      if (!project) {
        throw new BackendError("PROJECT_NOT_FOUND", "Project was not found.", {
          statusCode: 404,
          details: { projectId },
        });
      }

      return project;
    },
  };
}

async function readSnapshot(filePath: string): Promise<ProjectRegistrySnapshot> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as ProjectRegistrySnapshot;

    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    };
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return { projects: [] };
    }

    throw error;
  }
}

async function writeSnapshot(
  filePath: string,
  snapshot: ProjectRegistrySnapshot,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
