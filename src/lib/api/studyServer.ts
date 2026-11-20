import "server-only";

import { notFound, redirect } from "next/navigation";
import { createServerClient } from "./serverClient";
import { isApiError } from "./base";
import type { components } from "./schema";

type StudyOverview = components["schemas"]["StudyOverviewDto"];
type StudySession = components["schemas"]["StudySessionDto"];
type MeStats = components["schemas"]["MeStatsDto"];
type Agenda = components["schemas"]["AgendaDto"];
type DeckListItem = components["schemas"]["DeckListItemDto"];

function onAuthError(err: unknown): never {
  if (isApiError(err) && err.status === 401) redirect("/entrar");
  throw err;
}

export async function getStudyOverview(): Promise<StudyOverview> {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/study/overview");
    if (!data) throw new Error("overview vazio");
    return data;
  } catch (err) {
    onAuthError(err);
  }
}

export async function getStudySession(id: string): Promise<StudySession> {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/study/sessions/{id}", {
      params: { path: { id } },
    });
    if (!data) throw new Error("sessão vazia");
    return data;
  } catch (err) {
    // Id que não é UUID volta 400; de outra pessoa ou inexistente, 404.
    if (isApiError(err) && (err.status === 404 || err.status === 400)) notFound();
    onAuthError(err);
  }
}

export async function getMeStats(): Promise<MeStats> {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/me/stats");
    if (!data) throw new Error("stats vazio");
    return data;
  } catch (err) {
    onAuthError(err);
  }
}

export async function getAgenda(days: number): Promise<Agenda> {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/me/agenda", { params: { query: { days } } });
    if (!data) throw new Error("agenda vazia");
    return data;
  } catch (err) {
    onAuthError(err);
  }
}

export async function getRecentDecks(limit: number): Promise<DeckListItem[]> {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/decks/recent", { params: { query: { limit } } });
    return data ?? [];
  } catch (err) {
    onAuthError(err);
  }
}

/** Para a sidebar: se falhar, o número só aparece quando o cliente buscar. */
export async function getTodayCount(): Promise<number | undefined> {
  try {
    const agenda = await getAgenda(1);
    return agenda.days[0]?.total ?? 0;
  } catch (err) {
    if (isApiError(err)) return undefined;
    throw err;
  }
}
