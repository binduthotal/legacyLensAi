import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { BackendConfig } from "./config.ts";
import { createBackendConfig } from "./config.ts";
import { createBackendRouter } from "./router.ts";

export function createBackendServer(config: BackendConfig = createBackendConfig()) {
  const router = createBackendRouter(config);

  return createServer((request: IncomingMessage, response: ServerResponse) => {
    const result = router({
      method: request.method ?? "GET",
      url: request.url ?? "/",
    });

    response.writeHead(result.statusCode, result.headers);
    response.end(JSON.stringify(result.body));
  });
}
