import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { createFrontendConfig, type FrontendConfig } from "./config.ts";

export type StaticAsset = {
  readonly absolutePath: string;
  readonly contentType: string;
};

const contentTypes = new Map<string, string>([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

export function createFrontendServer(config: FrontendConfig = createFrontendConfig()) {
  const publicRoot = resolve(process.cwd(), "frontend", "public");

  return createServer((request, response) => {
    const asset = resolveStaticAsset(publicRoot, request.url ?? "/");

    if (!asset) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": asset.contentType,
      "cache-control": "no-store",
      "x-api-base-url": config.apiBaseUrl,
    });
    createReadStream(asset.absolutePath).pipe(response);
  });
}

export function resolveStaticAsset(
  publicRoot: string,
  requestUrl: string,
): StaticAsset | undefined {
  const path = new URL(requestUrl, "http://localhost").pathname;
  const requestedPath = path === "/" ? "/index.html" : path;
  const normalizedPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = resolve(join(publicRoot, normalizedPath));

  if (!absolutePath.startsWith(publicRoot) || !existsSync(absolutePath)) {
    return undefined;
  }

  return {
    absolutePath,
    contentType:
      contentTypes.get(extname(absolutePath)) ?? "application/octet-stream",
  };
}
