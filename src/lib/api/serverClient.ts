import "server-only";

import { cookies } from "next/headers";
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";
import { API_URL, ApiError, type ApiErrorBody } from "./base";

type ErrorBody = { error: ApiErrorBody };

async function parseErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    const data = (await response.clone().json()) as ErrorBody | ApiErrorBody;
    if (data && typeof data === "object" && "error" in data && data.error) {
      return data.error;
    }
    if (data && typeof data === "object" && "code" in data) {
      return data as ApiErrorBody;
    }
  } catch {
    // ignora
  }
  return {
    code: "UNKNOWN",
    message: response.statusText || "Erro inesperado.",
  };
}

const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.ok) return undefined;
    const body = await parseErrorBody(response);
    throw new ApiError(response.status, body);
  },
};

export async function createServerClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const client = createClient<paths>({
    baseUrl: API_URL,
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  client.use(errorMiddleware);
  return client;
}

export function hasSessionCookie(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  return cookieStore.has("sn_access");
}
