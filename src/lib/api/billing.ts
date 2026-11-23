"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";
import { INVOICES_PAGE } from "./constants";

export type Plans = components["schemas"]["PlansDto"];
export type PlanOption = components["schemas"]["PlanOptionDto"];
export type SubscriptionPlan = components["schemas"]["SubscriptionPlan"];
export type Subscription = components["schemas"]["SubscriptionSummaryDto"];
export type Invoice = components["schemas"]["InvoiceDto"];
export type InvoiceList = components["schemas"]["InvoiceListDto"];

export const billingKeys = {
  plans: ["billing", "plans"] as const,
  subscription: ["billing", "subscription"] as const,
  invoices: ["billing", "invoices"] as const,
};

export function usePlans(initial?: Plans) {
  return useQuery<Plans>({
    queryKey: billingKeys.plans,
    queryFn: async () => {
      const { data } = await api.GET("/v1/billing/plans");
      if (!data) throw new Error("GET /v1/billing/plans vazio");
      return data;
    },
    initialData: initial,
    staleTime: 10 * 60_000,
  });
}

export function useSubscription(initial?: Subscription) {
  return useQuery<Subscription>({
    queryKey: billingKeys.subscription,
    queryFn: async () => {
      const { data } = await api.GET("/v1/billing/subscription");
      if (!data) throw new Error("GET /v1/billing/subscription vazio");
      return data;
    },
    initialData: initial,
    staleTime: 0,
  });
}

export function useInvoices(initial?: InvoiceList) {
  return useInfiniteQuery<InvoiceList, Error, InfiniteData<InvoiceList>, typeof billingKeys.invoices, string | null>({
    queryKey: billingKeys.invoices,
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.GET("/v1/billing/invoices", {
        params: { query: { cursor: pageParam ?? undefined, limit: INVOICES_PAGE } },
      });
      if (!data) throw new Error("GET /v1/billing/invoices vazio");
      return data;
    },
    initialData: initial ? { pages: [initial], pageParams: [null] } : undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

/** Checkout do provedor (assinar ou mudar de plano): sai do app e volta em /perfil/assinatura. */
export function useCheckout() {
  return useMutation({
    mutationFn: async (plan: SubscriptionPlan) => {
      const { data } = await api.POST("/v1/billing/checkout", { body: { plan } });
      if (!data) throw new Error("checkout vazio");
      window.location.assign(data.url);
      return data;
    },
  });
}

/** Portal do provedor: gerenciar, trocar ou atualizar o cartão e cancelar. */
export function usePortal() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.POST("/v1/billing/portal");
      if (!data) throw new Error("portal vazio");
      window.location.assign(data.url);
      return data;
    },
  });
}
