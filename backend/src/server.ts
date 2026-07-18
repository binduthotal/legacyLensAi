import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { BackendConfig } from "./config.ts";
import { createBackendConfig } from "./config.ts";
import { BackendError, toErrorResponse } from "./errors.ts";
import { createBackendRouter } from "./router.ts";

export function createBackendServer(config: BackendConfig = createBackendConfig()) {
  const router = createBackendRouter(config);

  return createServer(async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const result = await router({
        method: request.method ?? "GET",
        url: request.url ?? "/",
        body: await readJsonBody(request),
      });

      response.writeHead(result.statusCode, result.headers);
      response.end(JSON.stringify(result.body));
    } catch (error) {
      const result = toErrorResponse(error);
      response.writeHead(result.statusCode, {
        "access-control-allow-headers": "content-type",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-origin": "*",
        "content-type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify(result.body));
    }
  });
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const method = request.method?.toUpperCase() ?? "GET";

  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return undefined;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (rawBody.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new BackendError("INVALID_JSON", "Request body must be valid JSON.", {
      statusCode: 400,
    });
  }
}
