"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type CardItem = components["schemas"]["CardItemDto"];
export type CardStatus = CardItem["status"];
export type CardListResponse = components["schemas"]["CardListResponseDto"];
export type CardListCounts = components["schemas"]["CardListCountsDto"];

export type CardListFilterStatus = "all" | "due" | "new" | "mastered";

export type CardListFilters = {
  deckId: string;
  status: CardListFilterStatus;
  q: string;
};

export function cardsKey(filters: CardListFilters) {
  return ["cards", filters.deckId, { status: filters.status, q: filters.q }] as const;
}

export function useCardsQuery(filters: CardListFilters, enabled = true) {
  return useInfiniteQuery<
    CardListResponse,
    Error,
    InfiniteData<CardListResponse>,
    ReturnType<typeof cardsKey>,
    string | null
  >({
    queryKey: cardsKey(filters),
    enabled,
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.GET("/v1/decks/{id}/cards", {
        params: {
          path: { id: filters.deckId },
          query: {
            status: filters.status,
            q: filters.q.trim() ? filters.q.trim() : undefined,
            cursor: pageParam ?? undefined,
            limit: 20,
          },
        },
      });
      if (!data) throw new Error("GET cards vazio");
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCreateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deckId,
      question,
      answer,
    }: {
      deckId: string;
      question: string;
      answer: string;
    }) => {
      const { data } = await api.POST("/v1/decks/{id}/cards", {
        params: { path: { id: deckId } },
        body: { question, answer },
      });
      if (!data) throw new Error("criar card vazio");
      return { deckId, card: data };
    },
    onSuccess: ({ deckId }) => {
      qc.invalidateQueries({ queryKey: ["cards", deckId] });
      qc.invalidateQueries({ queryKey: ["deck", deckId] });
    },
  });
}

export function useUpdateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deckId,
      id,
      question,
      answer,
    }: {
      deckId: string;
      id: string;
      question?: string;
      answer?: string;
    }) => {
      const body: Record<string, string> = {};
      if (question !== undefined) body.question = question;
      if (answer !== undefined) body.answer = answer;
      const { data } = await api.PATCH("/v1/cards/{id}", {
        params: { path: { id } },
        body: body as components["schemas"]["UpdateCardDto"],
      });
      if (!data) throw new Error("atualizar card vazio");
      return { deckId, card: data };
    },
    onSuccess: ({ deckId }) => {
      qc.invalidateQueries({ queryKey: ["cards", deckId] });
    },
  });
}

export function useDeleteCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ deckId, id }: { deckId: string; id: string }) => {
      await api.DELETE("/v1/cards/{id}", { params: { path: { id } } });
      return { deckId, id };
    },
    onSuccess: ({ deckId }) => {
      qc.invalidateQueries({ queryKey: ["cards", deckId] });
      qc.invalidateQueries({ queryKey: ["deck", deckId] });
    },
  });
}
