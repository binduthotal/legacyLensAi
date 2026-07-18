import type { BackendConfig } from "./config.ts";
import { BackendError, toErrorResponse } from "./errors.ts";
import { createHealthSnapshot } from "./health.ts";
import type { HttpRequest, JsonResponse } from "./http.ts";
import { jsonResponse } from "./http.ts";
import {
  analyzeProject,
  parseProjectAnalysisRequest,
} from "./project-analysis.ts";

export function createBackendRouter(config: BackendConfig) {
  return async function route(request: HttpRequest): Promise<JsonResponse> {
    try {
      const method = request.method.toUpperCase();
      const path = new URL(request.url, "http://localhost").pathname;

      if (method === "OPTIONS") {
        return jsonResponse(204, undefined);
      }

      if (method === "GET" && (path === "/health" || path === "/api/v1/health")) {
        return jsonResponse(200, createHealthSnapshot(config));
      }

      if (method === "GET" && (path === "/ready" || path === "/api/v1/ready")) {
        return jsonResponse(200, {
          status: "ready",
          service: config.serviceName,
          version: config.serviceVersion,
        });
      }

      if (method === "POST" && path === "/api/v1/projects/analyze") {
        const analysisRequest = parseProjectAnalysisRequest(request.body);
        const analysis = await analyzeProject(analysisRequest);
        return jsonResponse(200, analysis);
      }

      throw new BackendError("ROUTE_NOT_FOUND", "Route was not found.", {
        statusCode: 404,
        details: {
          method,
          path,
        },
      });
    } catch (error) {
      const errorResponse = toErrorResponse(error);
      return jsonResponse(errorResponse.statusCode, errorResponse.body);
    }
  };
}
