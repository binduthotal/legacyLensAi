export type HttpRequest = {
  readonly method: string;
  readonly url: string;
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
      "content-type": "application/json; charset=utf-8",
    },
    body,
  };
}
