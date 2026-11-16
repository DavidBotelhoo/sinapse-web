"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type Me = components["schemas"]["MeResponseDto"];

export function useMe() {
  return useQuery<Me | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/me");
      return data ?? null;
    },
  });
}
