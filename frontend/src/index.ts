export {
  createFrontendConfig,
  type FrontendConfig,
} from "./config.ts";
export {
  createFrontendServer,
  resolveStaticAsset,
  type StaticAsset,
} from "./server.ts";

export const frontendPackage = {
  name: "@legacylens/frontend",
  responsibility: "web-application-shell",
} as const;
