export type ErrorResponse = {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details: Record<string, unknown>;
  };
};

export class BackendError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: Record<string, unknown>;

  public constructor(
    code: string,
    message: string,
    options: {
      readonly statusCode?: number;
      readonly details?: Record<string, unknown>;
    } = {},
  ) {
    super(message);
    this.name = "BackendError";
    this.code = code;
    this.statusCode = options.statusCode ?? 500;
    this.details = options.details ?? {};
  }
}

export function toErrorResponse(error: unknown): {
  readonly statusCode: number;
  readonly body: ErrorResponse;
} {
  if (error instanceof BackendError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
        details: {},
      },
    },
  };
}
