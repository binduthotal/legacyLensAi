import { readFile } from "node:fs/promises";
import type { DiscoveredSourceFile } from "./source-discovery.ts";

export type SourceArtifact = {
  readonly path: string;
  readonly language: DiscoveredSourceFile["language"];
  readonly sizeBytes: number;
  readonly lineCount: number;
  readonly content: string;
};

export type SourceParserContext = {
  readonly projectRoot: string;
};

export type ParserAdapter<TResult> = {
  readonly language: DiscoveredSourceFile["language"];
  parse(artifact: SourceArtifact, context: SourceParserContext): Promise<TResult>;
};

export async function createSourceArtifact(
  file: DiscoveredSourceFile,
): Promise<SourceArtifact> {
  const content = await readFile(file.absolutePath, "utf8");

  return {
    path: file.relativePath,
    language: file.language,
    sizeBytes: file.sizeBytes,
    lineCount: countLines(content),
    content,
  };
}

function countLines(content: string): number {
  if (content.length === 0) {
    return 0;
  }

  return content.split(/\r\n|\r|\n/).length;
}
