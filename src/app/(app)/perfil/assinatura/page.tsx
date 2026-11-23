import { getBillingPage } from "@/lib/api/billingServer";
import { INVOICES_PAGE } from "@/lib/api/constants";
import { BillingPage } from "@/components/billing/BillingPage";

export const metadata = {
  title: "Assinatura · Sinapse",
};

/** Aba Assinatura (telas 26, 27 e 28). */
export default async function AssinaturaPage() {
  const { plans, subscription, invoices } = await getBillingPage(INVOICES_PAGE);
  return (
    <BillingPage initialPlans={plans} initialSubscription={subscription} initialInvoices={invoices} />
  );
}
