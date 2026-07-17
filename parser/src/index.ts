export {
  defaultDiscoveryOptions,
  discoverSourceFiles,
  type DiscoveredSourceFile,
  type SourceDiscoveryOptions,
} from "./source-discovery.ts";
export {
  detectLanguage,
  supportedLanguages,
  type SourceLanguage,
} from "./language-detection.ts";
export {
  createSourceArtifact,
  type ParserAdapter,
  type SourceArtifact,
  type SourceParserContext,
} from "./contracts.ts";

export const parserPackage = {
  name: "@legacylens/parser",
  responsibility: "source-analysis-shell",
} as const;
