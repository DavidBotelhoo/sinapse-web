"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type DeckListItem = components["schemas"]["DeckListItemDto"];
export type DeckListResponse = components["schemas"]["DeckListResponseDto"];
export type DeckDetail = components["schemas"]["DeckDetailDto"];
export type DeckListCounts = components["schemas"]["DeckListCountsDto"];
export type Visibility = "PRIVATE" | "PUBLIC";
export type Scope = "all" | "mine" | "community" | "favorites";

export type DeckListFilters = {
  scope: Scope;
  year: ReadonlyArray<number>;
  subjectIds: ReadonlyArray<string>;
  q: string;
};

export function decksKey(filters: DeckListFilters) {
  return ["decks", filters] as const;
}

export function useDecksQuery(filters: DeckListFilters) {
  return useInfiniteQuery<
    DeckListResponse,
    Error,
    InfiniteData<DeckListResponse>,
    ReturnType<typeof decksKey>,
    string | null
  >({
    queryKey: decksKey(filters),
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.GET("/v1/decks", {
        params: {
          query: {
            scope: filters.scope,
            year: filters.year.length > 0 ? [...filters.year] : undefined,
            subjectIds: filters.subjectIds.length > 0 ? [...filters.subjectIds] : undefined,
            q: filters.q.trim() ? filters.q.trim() : undefined,
            cursor: pageParam ?? undefined,
            limit: 20,
          },
        },
      });
      if (!data) throw new Error("GET /v1/decks vazio");
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useDeckQuery(id: string | null) {
  return useQuery<DeckDetail>({
    queryKey: ["deck", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await api.GET("/v1/decks/{id}", { params: { path: { id: id! } } });
      if (!data) throw new Error("deck vazio");
      return data;
    },
  });
}

type CreateDeckInput = {
  importId: string;
  name: string;
  year: number;
  subjectIds: ReadonlyArray<string>;
  visibility: Visibility;
};

export function useCreateDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDeckInput) => {
      const { data } = await api.POST("/v1/decks", {
        body: {
          importId: input.importId,
          name: input.name,
          year: input.year,
          subjectIds: [...input.subjectIds],
          visibility: input.visibility,
        },
      });
      if (!data) throw new Error("criar deck vazio");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

type UpdateDeckInput = {
  id: string;
  name?: string;
  year?: number;
  subjectIds?: ReadonlyArray<string>;
  visibility?: Visibility;
};

export function useUpdateDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateDeckInput) => {
      const body: Record<string, unknown> = {};
      if (input.name !== undefined) body.name = input.name;
      if (input.year !== undefined) body.year = input.year;
      if (input.subjectIds !== undefined) body.subjectIds = [...input.subjectIds];
      if (input.visibility !== undefined) body.visibility = input.visibility;
      const { data } = await api.PATCH("/v1/decks/{id}", {
        params: { path: { id: input.id } },
        body: body as components["schemas"]["UpdateDeckDto"],
      });
      if (!data) throw new Error("atualizar deck vazio");
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["deck", data.id], data);
      qc.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useDeleteDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.DELETE("/v1/decks/{id}", { params: { path: { id } } });
      return id;
    },
    onSuccess: (id) => {
      qc.removeQueries({ queryKey: ["deck", id] });
      qc.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, favorite }: { id: string; favorite: boolean }) => {
      if (favorite) {
        await api.PUT("/v1/decks/{id}/favorite", { params: { path: { id } } });
      } else {
        await api.DELETE("/v1/decks/{id}/favorite", { params: { path: { id } } });
      }
      return { id, favorite };
    },
    onSuccess: ({ id, favorite }) => {
      qc.setQueryData<DeckDetail>(["deck", id], (prev) =>
        prev ? { ...prev, isFavorite: favorite } : prev,
      );
      qc.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useToggleSaved() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, saved }: { id: string; saved: boolean }) => {
      if (saved) {
        await api.PUT("/v1/decks/{id}/save", { params: { path: { id } } });
      } else {
        await api.DELETE("/v1/decks/{id}/save", { params: { path: { id } } });
      }
      return { id, saved };
    },
    onSuccess: ({ id, saved }) => {
      qc.setQueryData<DeckDetail>(["deck", id], (prev) =>
        prev ? { ...prev, isSaved: saved } : prev,
      );
      qc.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useAppendImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ deckId, importId }: { deckId: string; importId: string }) => {
      const { data } = await api.POST("/v1/decks/{id}/imports", {
        params: { path: { id: deckId } },
        body: { importId },
      });
      if (!data) throw new Error("append import vazio");
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["deck", data.id], data);
      qc.invalidateQueries({ queryKey: ["cards", data.id] });
    },
  });
}
