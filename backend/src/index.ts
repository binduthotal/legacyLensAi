export { createBackendConfig, type BackendConfig } from "./config.ts";
export { BackendError, toErrorResponse } from "./errors.ts";
export { createHealthSnapshot, type HealthSnapshot } from "./health.ts";
export { createBackendRouter } from "./router.ts";
export { createBackendServer } from "./server.ts";
export {
  analyzeProject,
  parseProjectAnalysisRequest,
  type ProjectAnalysisRequest,
  type ProjectAnalysisSummary,
} from "./project-analysis.ts";

export const backendPackage = {
  name: "@legacylens/backend",
  responsibility: "api-and-orchestration-shell",
} as const;
