"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URL, ApiError } from "./base";
import { api } from "./client";
import type { components } from "./schema";

export type ImportDetail = components["schemas"]["ImportDetailDto"];
export type ImportCreated = components["schemas"]["ImportCreatedDto"];
export type ImportPair = components["schemas"]["ImportPairDto"];
export type ImportStatus = ImportDetail["status"];

async function parseErrorBody(response: Response) {
  try {
    const data = (await response.clone().json()) as { error?: { code: string; message: string; fields?: Record<string, string> } };
    if (data.error) return data.error;
  } catch {
    // ignore
  }
  return { code: "UNKNOWN", message: response.statusText || "Erro inesperado." };
}

export function useCreateImport() {
  return useMutation({
    mutationFn: async (file: File): Promise<ImportCreated> => {
      // openapi-fetch não trata multipart elegantemente; vou direto no fetch
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_URL}/v1/imports`, {
        method: "POST",
        body: form,
        credentials: "include",
      });
      if (!res.ok) {
        const body = await parseErrorBody(res);
        throw new ApiError(res.status, body);
      }
      return (await res.json()) as ImportCreated;
    },
  });
}

export function useImportQuery(id: string | null) {
  return useQuery<ImportDetail>({
    queryKey: ["import", id],
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 1_000;
      if (data.status === "PENDING" || data.status === "PROCESSING") return 1_000;
      return false;
    },
    queryFn: async () => {
      const { data } = await api.GET("/v1/imports/{id}", { params: { path: { id: id! } } });
      if (!data) throw new Error("import vazio");
      return data;
    },
  });
}
