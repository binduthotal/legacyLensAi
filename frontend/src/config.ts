export type FrontendConfig = {
  readonly host: string;
  readonly port: number;
  readonly apiBaseUrl: string;
};

type EnvironmentInput = Record<string, string | undefined>;

export function createFrontendConfig(env: EnvironmentInput = process.env): FrontendConfig {
  return {
    host: env.FRONTEND_HOST ?? "127.0.0.1",
    port: parsePort(env.FRONTEND_PORT ?? "3000"),
    apiBaseUrl: env.API_URL ?? "http://127.0.0.1:4000",
  };
}

function parsePort(value: string): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid frontend port "${value}". Expected an integer from 1 to 65535.`,
    );
  }

  return port;
}
