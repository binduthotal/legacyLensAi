import type { BackendConfig } from "./config.ts";

export type HealthSnapshot = {
  readonly status: "ok";
  readonly service: string;
  readonly version: string;
  readonly environment: BackendConfig["environment"];
  readonly uptimeSeconds: number;
  readonly timestamp: string;
};

export function createHealthSnapshot(
  config: BackendConfig,
  now: Date = new Date(),
): HealthSnapshot {
  return {
    status: "ok",
    service: config.serviceName,
    version: config.serviceVersion,
    environment: config.environment,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: now.toISOString(),
  };
}
