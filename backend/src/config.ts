export type BackendConfig = {
  readonly environment: "development" | "test" | "production";
  readonly host: string;
  readonly port: number;
  readonly serviceName: string;
  readonly serviceVersion: string;
};

type EnvironmentInput = Record<string, string | undefined>;

const validEnvironments = ["development", "test", "production"] as const;

export function createBackendConfig(env: EnvironmentInput = process.env): BackendConfig {
  const environment = parseEnvironment(env.NODE_ENV);
  const port = parsePort(env.PORT ?? env.API_PORT ?? "4000");

  return {
    environment,
    host: env.API_HOST ?? "127.0.0.1",
    port,
    serviceName: env.SERVICE_NAME ?? "legacylens-backend",
    serviceVersion: env.SERVICE_VERSION ?? "0.1.0",
  };
}

function parseEnvironment(value: string | undefined): BackendConfig["environment"] {
  if (!value) {
    return "development";
  }

  if (validEnvironments.includes(value as BackendConfig["environment"])) {
    return value as BackendConfig["environment"];
  }

  throw new Error(
    `Invalid NODE_ENV "${value}". Expected one of: ${validEnvironments.join(", ")}.`,
  );
}

function parsePort(value: string): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid API port "${value}". Expected an integer from 1 to 65535.`);
  }

  return port;
}
