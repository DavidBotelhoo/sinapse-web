"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type CommunityDeck = components["schemas"]["CommunityDeckDto"];
export type CommunityDeckList = components["schemas"]["CommunityDeckListDto"];
export type CommunityDeckDetail = components["schemas"]["CommunityDeckDetailDto"];
export type CommunitySort = components["schemas"]["CommunitySort"];
export type ReportReason = components["schemas"]["ReportReason"];

export type CommunityFilters = {
  sort: CommunitySort;
  year: ReadonlyArray<number>;
  subjectIds: ReadonlyArray<string>;
  q: string;
};

const PAGE_SIZE = 24;

export function communityKey(filters: CommunityFilters) {
  return ["community", filters] as const;
}

export function useCommunityDecks(filters: CommunityFilters) {
  return useInfiniteQuery<
    CommunityDeckList,
    Error,
    InfiniteData<CommunityDeckList>,
    ReturnType<typeof communityKey>,
    string | null
  >({
    queryKey: communityKey(filters),
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.GET("/v1/community/decks", {
        params: {
          query: {
            sort: filters.sort,
            year: filters.year.length > 0 ? [...filters.year] : undefined,
            subjectIds: filters.subjectIds.length > 0 ? [...filters.subjectIds] : undefined,
            q: filters.q.trim() ? filters.q.trim() : undefined,
            cursor: pageParam ?? undefined,
            limit: PAGE_SIZE,
          },
        },
      });
      if (!data) throw new Error("GET /v1/community/decks vazio");
      return data;
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

type SaveVars = { id: string; saved: boolean };
type Snapshot = Array<[readonly unknown[], InfiniteData<CommunityDeckList> | undefined]>;

/**
 * Salvar ou tirar um deck da Comunidade, com atualização otimista: o botão e o "N salvaram"
 * mudam na hora em todas as listas em cache; se a API falhar, tudo volta.
 */
export function useToggleCommunitySave() {
  const qc = useQueryClient();
  return useMutation<SaveVars, Error, SaveVars, { snapshot: Snapshot }>({
    mutationFn: async ({ id, saved }) => {
      if (saved) await api.PUT("/v1/decks/{id}/save", { params: { path: { id } } });
      else await api.DELETE("/v1/decks/{id}/save", { params: { path: { id } } });
      return { id, saved };
    },
    onMutate: async ({ id, saved }) => {
      await qc.cancelQueries({ queryKey: ["community"] });
      const snapshot = qc.getQueriesData<InfiniteData<CommunityDeckList>>({ queryKey: ["community"] });
      qc.setQueriesData<InfiniteData<CommunityDeckList>>({ queryKey: ["community"] }, (prev) =>
        prev
          ? {
              ...prev,
              pages: prev.pages.map((page) => ({
                ...page,
                items: page.items.map((d) =>
                  d.id === id && d.isSaved !== saved
                    ? { ...d, isSaved: saved, saveCount: Math.max(0, d.saveCount + (saved ? 1 : -1)) }
                    : d,
                ),
              })),
            }
          : prev,
      );
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      for (const [key, data] of ctx?.snapshot ?? []) qc.setQueryData(key, data);
    },
    onSettled: (_data, _err, vars) => {
      void qc.invalidateQueries({ queryKey: ["community"] });
      void qc.invalidateQueries({ queryKey: ["decks"] });
      void qc.invalidateQueries({ queryKey: ["deck", vars.id] });
      void qc.invalidateQueries({ queryKey: ["agenda"] });
    },
  });
}

export function useReportDeck() {
  return useMutation({
    mutationFn: async ({ id, reason, details }: { id: string; reason: ReportReason; details?: string }) => {
      await api.POST("/v1/decks/{id}/report", {
        params: { path: { id } },
        body: { reason, details: details?.trim() ? details.trim() : null },
      });
    },
  });
}
