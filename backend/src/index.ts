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
export {
  discoverIntakeFiles,
  previewProjectIntake,
  validateProjectIntake,
  type ProjectIntake,
  type ProjectIntakePreview,
  type ProjectIntakeRequest,
} from "./project-intake.ts";
export {
  answerProjectQuestion,
  parseProjectQuestionRequest,
  type ProjectQuestionAnswer,
  type ProjectQuestionRequest,
} from "./project-question.ts";
export {
  createFileProjectRegistry,
  type ProjectRecord,
  type ProjectRegistry,
  type ProjectRegistrySnapshot,
} from "./project-registry.ts";
export {
  readProjectSourceFile,
  type SourceFileDetail,
} from "./source-file.ts";

export const backendPackage = {
  name: "@legacylens/backend",
  responsibility: "api-and-orchestration-shell",
} as const;
