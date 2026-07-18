import assert from "node:assert/strict";
import test from "node:test";
import {
  BackendError,
  createBackendConfig,
  createBackendRouter,
  toErrorResponse,
} from "../backend/src/index.ts";

test("backend config uses safe defaults", () => {
  const config = createBackendConfig({});

  assert.equal(config.environment, "development");
  assert.equal(config.host, "127.0.0.1");
  assert.equal(config.port, 4000);
  assert.equal(config.serviceName, "legacylens-backend");
});

test("backend config validates environment and port", () => {
  assert.throws(() => createBackendConfig({ NODE_ENV: "staging" }), /Invalid NODE_ENV/);
  assert.throws(() => createBackendConfig({ PORT: "70000" }), /Invalid API port/);
});

test("health route returns source-independent service status", async () => {
  const router = createBackendRouter(
    createBackendConfig({
      NODE_ENV: "test",
      SERVICE_NAME: "test-service",
      SERVICE_VERSION: "9.9.9",
    }),
  );

  const response = await router({ method: "GET", url: "/api/v1/health" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "test-service");
  assert.equal(response.body.version, "9.9.9");
  assert.equal(response.body.environment, "test");
  assert.match(response.body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test("ready route returns readiness payload", async () => {
  const router = createBackendRouter(createBackendConfig({ NODE_ENV: "test" }));
  const response = await router({ method: "GET", url: "/ready" });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    status: "ready",
    service: "legacylens-backend",
    version: "0.1.0",
  });
});

test("unknown routes use structured API errors", async () => {
  const router = createBackendRouter(createBackendConfig({ NODE_ENV: "test" }));
  const response = await router({ method: "POST", url: "/missing" });

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, {
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Route was not found.",
      details: {
        method: "POST",
        path: "/missing",
      },
    },
  });
});

test("backend errors convert to stable error responses", () => {
  const response = toErrorResponse(
    new BackendError("INVALID_INPUT", "Input was invalid.", {
      statusCode: 400,
      details: { field: "name" },
    }),
  );

  assert.deepEqual(response, {
    statusCode: 400,
    body: {
      error: {
        code: "INVALID_INPUT",
        message: "Input was invalid.",
        details: { field: "name" },
      },
    },
  });
});
