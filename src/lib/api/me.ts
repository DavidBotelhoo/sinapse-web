import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "./serverClient";
import { isApiError } from "./base";
import type { components } from "./schema";

export type Me = components["schemas"]["MeResponseDto"];

export const getMe = cache(async (): Promise<Me | null> => {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/me");
    return data ?? null;
  } catch (err) {
    if (isApiError(err) && err.status === 401) return null;
    throw err;
  }
});

export async function getMeOrRedirect(): Promise<Me> {
  const me = await getMe();
  if (!me) redirect("/entrar");
  return me;
}
