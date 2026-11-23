"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type Me = components["schemas"]["MeResponseDto"];
export type ThemePreference = Me["theme"];
export type UpdateMeInput = components["schemas"]["UpdateMeDto"];

export const meKey = ["me"] as const;

export async function fetchMe(): Promise<Me> {
  const { data } = await api.GET("/v1/me");
  if (!data) throw new Error("GET /v1/me vazio");
  return data;
}

/** O usuário logado. Com `initial` (vindo do servidor), não espera a primeira busca. */
export function useMe(initial?: Me) {
  return useQuery<Me>({
    queryKey: meKey,
    queryFn: fetchMe,
    initialData: initial,
    staleTime: 60_000,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateMeInput): Promise<Me> => {
      const { data } = await api.PATCH("/v1/me", { body: input });
      if (!data) throw new Error("PATCH /v1/me vazio");
      return data;
    },
    onSuccess: (me) => qc.setQueryData(meKey, me),
  });
}

export function useChangePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { currentPassword: string; newPassword: string }) => {
      await api.POST("/v1/me/password", { body: input });
    },
    // "Alterada há…" passa a contar de agora.
    onSuccess: () => void qc.invalidateQueries({ queryKey: meKey }),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File): Promise<Me> => {
      const form = new FormData();
      form.append("file", file);
      // Com FormData, o navegador define o Content-Type com o boundary.
      const { data } = await api.POST("/v1/me/avatar", { body: form as unknown as { file: string } });
      if (!data) throw new Error("POST /v1/me/avatar vazio");
      return data;
    },
    onSuccess: (me) => qc.setQueryData(meKey, me),
  });
}

export function useRemoveAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<Me> => {
      const { data } = await api.DELETE("/v1/me/avatar");
      if (!data) throw new Error("DELETE /v1/me/avatar vazio");
      return data;
    },
    onSuccess: (me) => qc.setQueryData(meKey, me),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.POST("/v1/auth/logout");
    },
    // Mesmo se a API falhar, a sessão local some: o cache não pode guardar dados da conta.
    onSettled: () => qc.clear(),
  });
}
