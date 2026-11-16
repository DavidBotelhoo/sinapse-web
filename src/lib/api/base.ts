export const API_URL =
  typeof window === "undefined"
    ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333");

export type ApiErrorBody = {
  code: string;
  message: string;
  fields?: Record<string, string>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: Record<string, string>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.fields = body.fields ?? {};
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}
