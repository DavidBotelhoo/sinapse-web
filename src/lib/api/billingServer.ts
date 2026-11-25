import "server-only";

import { redirect } from "next/navigation";
import { createServerClient } from "./serverClient";
import { API_URL, isApiError } from "./base";
import type { components } from "./schema";

type Plans = components["schemas"]["PlansDto"];
type Subscription = components["schemas"]["SubscriptionSummaryDto"];
type InvoiceList = components["schemas"]["InvoiceListDto"];

/** O que a aba Assinatura precisa para renderizar no servidor. Mesmo tamanho de página do cliente. */
export async function getBillingPage(invoicesPage: number): Promise<{
  plans: Plans;
  subscription: Subscription;
  invoices: InvoiceList;
}> {
  const client = await createServerClient();
  try {
    const [plans, subscription, invoices] = await Promise.all([
      client.GET("/v1/billing/plans"),
      client.GET("/v1/billing/subscription"),
      client.GET("/v1/billing/invoices", { params: { query: { limit: invoicesPage } } }),
    ]);
    if (!plans.data || !subscription.data || !invoices.data) throw new Error("billing vazio");
    return { plans: plans.data, subscription: subscription.data, invoices: invoices.data };
  } catch (err) {
    if (isApiError(err) && err.status === 401) redirect("/entrar");
    throw err;
  }
}

/**
 * Planos da landing: rota pública, sem cookie, guardada por 5 minutos para a página continuar estática.
 * Se a API não responder, devolve null e a landing mostra os planos sem preço.
 */
export async function getPublicPlans(): Promise<Plans | null> {
  try {
    const res = await fetch(`${API_URL}/v1/billing/plans`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as Plans;
  } catch {
    return null;
  }
}
