# Module 3: Backend API Foundation

## Objective

Create a minimal backend API foundation that can run locally without external
dependencies and can support future parser, AI, database, and frontend modules.

## Scope

- Backend configuration loading from environment variables.
- Health and readiness endpoints.
- Structured API error responses.
- HTTP server factory using Node built-ins.
- Unit tests for configuration, health, readiness, and errors.

## Endpoints

- `GET /health`
- `GET /api/v1/health`
- `GET /ready`
- `GET /api/v1/ready`

Unknown routes return:

```json
{
  "error": {
    "code": "ROUTE_NOT_FOUND",
    "message": "Route was not found.",
    "details": {
      "method": "GET",
      "path": "/unknown"
    }
  }
}
```

## Configuration

Supported variables:

- `NODE_ENV`: `development`, `test`, or `production`
- `API_HOST`: defaults to `127.0.0.1`
- `PORT` or `API_PORT`: defaults to `4000`
- `SERVICE_NAME`: defaults to `legacylens-backend`
- `SERVICE_VERSION`: defaults to `0.1.0`

## Validation

Run:

```bash
npm.cmd run validate
npm.cmd run build
npm.cmd run test
```

Run the backend:

```bash
npm.cmd run dev
```

## Non-Goals

- No database connection.
- No authentication.
- No parser orchestration.
- No AI orchestration.
- No frontend integration.

## Next Recommended Module

Module 4: Parser Foundation

Suggested scope:

- Add source discovery.
- Add language detection.
- Define parser contracts.
- Add sample project fixtures and tests.
