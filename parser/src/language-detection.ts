export type SourceLanguage =
  | "csharp"
  | "css"
  | "go"
  | "html"
  | "java"
  | "javascript"
  | "json"
  | "markdown"
  | "php"
  | "python"
  | "ruby"
  | "sql"
  | "typescript"
  | "unknown"
  | "xml"
  | "yaml";

export const supportedLanguages = [
  "csharp",
  "css",
  "go",
  "html",
  "java",
  "javascript",
  "json",
  "markdown",
  "php",
  "python",
  "ruby",
  "sql",
  "typescript",
  "unknown",
  "xml",
  "yaml",
] as const satisfies readonly SourceLanguage[];

const filenameLanguageMap = new Map<string, SourceLanguage>([
  ["dockerfile", "unknown"],
  ["makefile", "unknown"],
  ["package.json", "json"],
  ["tsconfig.json", "json"],
  ["readme", "markdown"],
]);

const extensionLanguageMap = new Map<string, SourceLanguage>([
  [".cs", "csharp"],
  [".css", "css"],
  [".go", "go"],
  [".htm", "html"],
  [".html", "html"],
  [".java", "java"],
  [".js", "javascript"],
  [".cjs", "javascript"],
  [".mjs", "javascript"],
  [".json", "json"],
  [".md", "markdown"],
  [".markdown", "markdown"],
  [".php", "php"],
  [".py", "python"],
  [".rb", "ruby"],
  [".sql", "sql"],
  [".ts", "typescript"],
  [".tsx", "typescript"],
  [".jsx", "javascript"],
  [".xml", "xml"],
  [".yaml", "yaml"],
  [".yml", "yaml"],
]);

export function detectLanguage(filePath: string): SourceLanguage {
  const normalizedPath = filePath.replaceAll("\\", "/");
  const fileName = normalizedPath.split("/").at(-1)?.toLowerCase() ?? "";
  const fileNameMatch = filenameLanguageMap.get(fileName);

  if (fileNameMatch) {
    return fileNameMatch;
  }

  const extension = fileName.includes(".")
    ? fileName.slice(fileName.lastIndexOf("."))
    : "";

  return extensionLanguageMap.get(extension) ?? "unknown";
}
