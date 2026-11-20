"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";
import { AGENDA_DAYS } from "./constants";

export type MeStats = components["schemas"]["MeStatsDto"];
export type Agenda = components["schemas"]["AgendaDto"];
export type AgendaDay = components["schemas"]["AgendaDayDto"];
export type AgendaDeck = components["schemas"]["AgendaDeckDto"];

export function agendaKey(date: string) {
  return ["agenda", AGENDA_DAYS, date] as const;
}

/** Agenda de revisão do Início. O dia escolhido busca de novo; a lista anterior fica até chegar a nova. */
export function useAgenda(initial: Agenda, date: string) {
  return useQuery<Agenda>({
    queryKey: agendaKey(date),
    queryFn: async () => {
      const { data } = await api.GET("/v1/me/agenda", {
        params: { query: { days: AGENDA_DAYS, date } },
      });
      if (!data) throw new Error("agenda vazia");
      return data;
    },
    initialData: date === initial.date ? initial : undefined,
    placeholderData: keepPreviousData,
  });
}

/** Cards para hoje (atrasados incluídos): o número ao lado de "Estudar" na sidebar. */
export function useTodayCount(initial?: number) {
  return useQuery<number>({
    queryKey: ["agenda", "today-count"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/me/agenda", { params: { query: { days: 1 } } });
      return data?.days[0]?.total ?? 0;
    },
    initialData: initial,
  });
}
