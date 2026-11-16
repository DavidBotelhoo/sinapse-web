"use client";

import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";
import { ApiError, API_URL, type ApiErrorBody } from "./base";

type ErrorBody = { error: ApiErrorBody };

let pendingRefresh: Promise<boolean> | null = null;

async function refreshOnce(): Promise<boolean> {
  if (!pendingRefresh) {
    pendingRefresh = (async () => {
      try {
        const res = await fetch(`${API_URL}/v1/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        return res.ok;
      } catch {
        return false;
      }
    })().finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
}

const NO_REFRESH_PATHS = new Set(["/v1/auth/refresh", "/v1/auth/login", "/v1/auth/logout"]);

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

const refreshMiddleware: Middleware = {
  async onResponse({ request, response }) {
    if (response.status !== 401) return undefined;

    const url = new URL(request.url);
    if (NO_REFRESH_PATHS.has(url.pathname)) return undefined;

    const ok = await refreshOnce();
    if (!ok) return undefined;

    const retry = await fetch(request.clone());
    return retry;
  },
};

const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.ok) return undefined;
    const body = await parseErrorBody(response);
    throw new ApiError(response.status, body);
  },
};

export const api = createClient<paths>({
  baseUrl: API_URL,
  credentials: "include",
});

api.use(refreshMiddleware);
api.use(errorMiddleware);
