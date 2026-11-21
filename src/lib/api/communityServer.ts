import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "./serverClient";
import { isApiError } from "./base";
import type { components } from "./schema";

type CommunityDeckDetail = components["schemas"]["CommunityDeckDetailDto"];

/** Prévia de um deck público. Privado, excluído, oculto ou id inválido viram 404. */
export const getCommunityDeck = cache(async (id: string): Promise<CommunityDeckDetail> => {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/community/decks/{id}", { params: { path: { id } } });
    if (!data) throw new Error("prévia vazia");
    return data;
  } catch (err) {
    if (isApiError(err)) {
      if (err.status === 401) redirect("/entrar");
      if (err.status === 404 || err.status === 400) notFound();
    }
    throw err;
  }
});
