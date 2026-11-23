"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCheck, Crown, Infinity as InfinityIcon, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/components/app/MeProvider";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { isApiError } from "@/lib/api/base";
import {
  useCheckout,
  useInvoices,
  usePlans,
  usePortal,
  useSubscription,
  type InvoiceList,
  type Plans,
  type Subscription,
  type SubscriptionPlan,
} from "@/lib/api/billing";
import { meKey, type Me } from "@/lib/api/useMe";
import { longDate, shortDate } from "./format";
import { PaymentNotice } from "./PaymentNotice";
import { PaymentsCard } from "./PaymentsCard";
import { PlanOptions, currentPaidPlan } from "./PlanOptions";

export type BillingPageProps = {
  initialPlans: Plans;
  initialSubscription: Subscription;
  initialInvoices: InvoiceList;
};

/** Aba Assinatura (telas 26, 27 e 28): situação, planos, pagamentos e cancelar. */
export function BillingPage({ initialPlans, initialSubscription, initialInvoices }: BillingPageProps) {
  const me = useCurrentUser();
  const tz = me.timezone;
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const plans = usePlans(initialPlans).data ?? initialPlans;
  const sub = useSubscription(initialSubscription).data ?? initialSubscription;
  const invoicesQ = useInvoices(initialInvoices);
  const invoices = invoicesQ.data?.pages.flatMap((p) => p.items) ?? initialInvoices.items;

  const checkout = useCheckout();
  const portal = usePortal();
  const [pending, setPending] = useState<SubscriptionPlan | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Volta do provedor (?checkout=sucesso|cancelado, ?portal=…): avisa, busca de novo e limpa a URL.
  const [returned] = useState(() => params.get("checkout"));
  const handledReturn = useRef(false);
  useEffect(() => {
    if (handledReturn.current) return;
    handledReturn.current = true;
    if (!params.get("checkout") && !params.get("portal")) return;
    void qc.invalidateQueries({ queryKey: ["billing"] });
    void qc.invalidateQueries({ queryKey: meKey });
    router.replace(pathname, { scroll: false });
  }, [params, pathname, qc, router]);

  // O acesso (estudar e importar) segue a assinatura: o resto do app lê de ["me"].
  useEffect(() => {
    qc.setQueryData<Me>(meKey, (prev) => (prev ? { ...prev, subscription: sub } : prev));
  }, [qc, sub]);

  function goCheckout(plan: SubscriptionPlan) {
    setError(null);
    setPending(plan);
    checkout.mutate(plan, {
      onError: (err) => {
        setPending(null);
        setError(
          isApiError(err) && err.status === 409
            ? "Você já assina este plano. Para mudar o cartão, use Gerenciar assinatura."
            : "Não foi possível abrir o pagamento. Tente de novo.",
        );
      },
    });
  }

  function goPortal() {
    setError(null);
    setPending("portal");
    portal.mutate(undefined, {
      onError: (err) => {
        setPending(null);
        setError(
          isApiError(err) && err.status === 409
            ? "Você ainda não tem uma assinatura paga para gerenciar."
            : "Não foi possível abrir o portal de pagamento. Tente de novo.",
        );
      },
    });
  }

  const paid = currentPaidPlan(sub);
  const canceled = sub.status === "CANCELED" || sub.cancelAtPeriodEnd;
  const canCancel = Boolean(paid) && !canceled;

  return (
    <div className="flex flex-col gap-7 md:gap-8">
      {returned === "sucesso" ? (
        <PaymentNotice tone="info" icon={<CircleCheck strokeWidth={1.75} />} title="Pagamento enviado">
          Sua assinatura aparece aqui assim que o provedor confirmar.
        </PaymentNotice>
      ) : returned === "cancelado" ? (
        <PaymentNotice tone="info" icon={<Crown strokeWidth={1.75} />} title="Você não concluiu o pagamento">
          Nada foi cobrado. Escolha um plano quando quiser.
        </PaymentNotice>
      ) : null}

      <StatusNotice sub={sub} timeZone={tz} />

      {error ? (
        <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
          {error}
        </p>
      ) : null}

      {sub.lifetime ? (
        <ProfileCard
          titleId="pf-vitalicio"
          title="Acesso vitalício"
          subtitle="Sua conta tem acesso completo ao Sinapse, sem cobrança."
        >
          <p className="m-0 flex items-center gap-2 text-ink-muted [&_svg]:size-5">
            <InfinityIcon aria-hidden strokeWidth={1.75} />
            Nada para pagar nem renovar.
          </p>
        </ProfileCard>
      ) : (
        <ProfileCard
          titleId="pf-plano"
          title="Plano"
          subtitle="Cancele quando quiser. O acesso continua até o fim do período pago."
        >
          <PlanOptions
            plans={plans}
            subscription={sub}
            timeZone={tz}
            onCheckout={goCheckout}
            onPortal={goPortal}
            pending={pending}
          />
        </ProfileCard>
      )}

      {invoices.length > 0 ? (
        <PaymentsCard
          invoices={invoices}
          timeZone={tz}
          onChangeCard={paid ? goPortal : undefined}
          changingCard={pending === "portal"}
          hasMore={Boolean(invoicesQ.hasNextPage)}
          loadingMore={invoicesQ.isFetchingNextPage}
          onLoadMore={() => invoicesQ.fetchNextPage()}
        />
      ) : null}

      {canCancel ? (
        <div className="flex max-md:justify-center">
          <Button variant="danger" size="sm" onClick={goPortal}>
            Cancelar assinatura
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/** O aviso do topo para cada situação (telas 27 e 28; teste grátis e sem assinatura, sem tela). */
function StatusNotice({ sub, timeZone }: { sub: Subscription; timeZone: string }) {
  if (sub.lifetime) return null;

  if (sub.status === "PAST_DUE") {
    return (
      <PaymentNotice role="alert" icon={<TriangleAlert strokeWidth={1.75} />} title="Não conseguimos cobrar seu cartão">
        Atualize a forma de pagamento{sub.graceUntil ? ` até ${shortDate(sub.graceUntil, timeZone)}` : ""} para não
        perder o acesso aos seus decks.
      </PaymentNotice>
    );
  }

  if (sub.status === "TRIALING") {
    return (
      <PaymentNotice tone="info" icon={<Crown strokeWidth={1.75} />} title={
        sub.trialEndsAt ? `Seu teste grátis vai até ${longDate(sub.trialEndsAt, timeZone)}` : "Você está no teste grátis"
      }>
        Assine quando quiser: seus decks e seu progresso continuam.
      </PaymentNotice>
    );
  }

  if (sub.status === "EXPIRED" || sub.status === "NONE") {
    const title = sub.plan
      ? "Sua assinatura terminou"
      : sub.trialEndsAt
        ? "Seu teste grátis terminou"
        : "Você ainda não assina o Sinapse";
    return (
      <PaymentNotice icon={<Crown strokeWidth={1.75} />} title={title}>
        Seus decks continuam salvos. Assine para voltar a estudar e importar novos arquivos.
      </PaymentNotice>
    );
  }

  return null;
}
