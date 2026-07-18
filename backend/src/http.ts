export type HttpRequest = {
  readonly method: string;
  readonly url: string;
  readonly body?: unknown;
};

export type JsonResponse = {
  readonly statusCode: number;
  readonly headers: Record<string, string>;
  readonly body: unknown;
};

export function jsonResponse(statusCode: number, body: unknown): JsonResponse {
  return {
    statusCode,
    headers: {
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8",
    },
    body,
  };
}
