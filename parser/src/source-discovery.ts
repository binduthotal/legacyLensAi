import { readdir, stat } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { detectLanguage, type SourceLanguage } from "./language-detection.ts";

export type DiscoveredSourceFile = {
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly language: SourceLanguage;
  readonly sizeBytes: number;
};

export type SourceDiscoveryOptions = {
  readonly ignoreDirectories?: readonly string[];
  readonly ignoreFiles?: readonly string[];
  readonly maxFileSizeBytes?: number;
};

export const defaultDiscoveryOptions = {
  ignoreDirectories: [
    ".git",
    ".next",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "out",
    "target",
  ],
  ignoreFiles: [".DS_Store", "Thumbs.db"],
  maxFileSizeBytes: 1024 * 1024,
} as const satisfies Required<SourceDiscoveryOptions>;

export async function discoverSourceFiles(
  rootPath: string,
  options: SourceDiscoveryOptions = {},
): Promise<DiscoveredSourceFile[]> {
  const resolvedRoot = resolve(rootPath);
  const mergedOptions = {
    ignoreDirectories:
      options.ignoreDirectories ?? defaultDiscoveryOptions.ignoreDirectories,
    ignoreFiles: options.ignoreFiles ?? defaultDiscoveryOptions.ignoreFiles,
    maxFileSizeBytes:
      options.maxFileSizeBytes ?? defaultDiscoveryOptions.maxFileSizeBytes,
  };

  const files: DiscoveredSourceFile[] = [];
  await walkDirectory(resolvedRoot, resolvedRoot, mergedOptions, files);

  return files.sort((left, right) =>
    left.relativePath.localeCompare(right.relativePath),
  );
}

async function walkDirectory(
  rootPath: string,
  currentPath: string,
  options: Required<SourceDiscoveryOptions>,
  files: DiscoveredSourceFile[],
): Promise<void> {
  const entries = await readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = resolve(currentPath, entry.name);

    if (entry.isDirectory()) {
      if (!options.ignoreDirectories.includes(entry.name)) {
        await walkDirectory(rootPath, absolutePath, options, files);
      }

      continue;
    }

    if (!entry.isFile() || options.ignoreFiles.includes(entry.name)) {
      continue;
    }

    const fileStat = await stat(absolutePath);
    if (fileStat.size > options.maxFileSizeBytes) {
      continue;
    }

    const relativePath = relative(rootPath, absolutePath).split(sep).join("/");
    files.push({
      absolutePath,
      relativePath,
      language: detectLanguage(relativePath),
      sizeBytes: fileStat.size,
    });
  }
}
