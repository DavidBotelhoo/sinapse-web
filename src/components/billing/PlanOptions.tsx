"use client";

import { Button } from "@/components/ui/Button";
import { PlanCard, PlansGrid } from "@/components/ui/PlanCard";
import { Tag } from "@/components/ui/Tag";
import type { PlanOption, Plans, Subscription, SubscriptionPlan } from "@/lib/api/billing";
import { cardLabel, formatBRL, longDate, shortDate } from "./format";

const HIGHLIGHTS = [
  "Decks e cards ilimitados",
  "Importação de PDF e Word",
  "Revisão espaçada com agenda",
  "Decks da Comunidade",
  "Estatísticas de estudo",
];

const NAME: Record<SubscriptionPlan, string> = { MONTHLY: "Pro mensal", YEARLY: "Pro anual" };
const SWITCH: Record<SubscriptionPlan, string> = { MONTHLY: "Mudar para o mensal", YEARLY: "Mudar para o anual" };
const SUBSCRIBE: Record<SubscriptionPlan, string> = { MONTHLY: "Assinar o mensal", YEARLY: "Assinar o anual" };

export function planName(plan: SubscriptionPlan) {
  return NAME[plan];
}

/** Plano pago atual: ativa, com pagamento recusado (prazo correndo) ou cancelada com acesso. */
export function currentPaidPlan(sub: Subscription): SubscriptionPlan | null {
  if (!sub.plan || sub.lifetime) return null;
  return sub.status === "ACTIVE" || sub.status === "PAST_DUE" || sub.status === "CANCELED" ? sub.plan : null;
}

export type PlanOptionsProps = {
  plans: Plans;
  subscription: Subscription;
  timeZone: string;
  onCheckout: (plan: SubscriptionPlan) => void;
  onPortal: () => void;
  pending: SubscriptionPlan | "portal" | null;
};

/** Os dois planos com os preços de /billing/plans e as ações de cada situação (telas 26 a 28). */
export function PlanOptions({ plans, subscription: sub, timeZone, onCheckout, onPortal, pending }: PlanOptionsProps) {
  const current = currentPaidPlan(sub);
  const pastDue = sub.status === "PAST_DUE";
  const canceled = sub.status === "CANCELED" || sub.cancelAtPeriodEnd;
  const card = cardLabel(sub.paymentMethodLabel);

  function priceParts(p: PlanOption) {
    const yearly = p.interval === "YEAR";
    return {
      priceLabel: formatBRL(p.priceCents),
      periodLabel: yearly ? "/ano" : "/mês",
      note: yearly ? `Equivale a ${formatBRL(p.monthlyEquivalentCents)} por mês, cobrado uma vez por ano.` : undefined,
      badge:
        p.freeMonths > 0 ? (
          <Tag tone="brand">{p.freeMonths === 1 ? "1 mês grátis" : `${p.freeMonths} meses grátis`}</Tag>
        ) : undefined,
    };
  }

  return (
    <PlansGrid>
      {plans.plans.map((p) => {
        const isCurrent = p.plan === current;
        const parts = priceParts(p);

        if (isCurrent) {
          const until = sub.accessUntil ?? sub.currentPeriodEnd;
          const statusLine = canceled
            ? `Cancelada · acesso até ${until ? longDate(until, timeZone) : "o fim do período"}`
            : [sub.currentPeriodEnd ? `Renova em ${longDate(sub.currentPeriodEnd, timeZone)}` : null, card]
                .filter(Boolean)
                .join(" · ");
          const warningLine = pastDue
            ? [
                sub.paymentFailedAt ? `Pagamento recusado em ${shortDate(sub.paymentFailedAt, timeZone)}` : "Pagamento recusado",
                card,
              ]
                .filter(Boolean)
                .join(" · ")
            : undefined;
          return (
            <PlanCard
              key={p.plan}
              name={NAME[p.plan]}
              {...parts}
              badge={undefined}
              highlights={HIGHLIGHTS}
              status={pastDue ? "declined" : "current"}
              statusLine={statusLine || undefined}
              warningLine={warningLine}
              action={
                <Button
                  variant={pastDue ? "primary" : "secondary"}
                  block
                  onClick={onPortal}
                  loading={pending === "portal"}
                  loadingText="Abrindo"
                >
                  {pastDue ? "Atualizar cartão" : "Gerenciar assinatura"}
                </Button>
              }
            />
          );
        }

        // Sem plano pago: o anual é o destaque (primário). Com plano: o outro é primário, menos com o
        // pagamento recusado, quando o primário é "Atualizar cartão" (um primário por tela).
        const primary = current ? !pastDue : p.plan === "YEARLY";
        return (
          <PlanCard
            key={p.plan}
            name={NAME[p.plan]}
            {...parts}
            highlights={HIGHLIGHTS}
            status="available"
            action={
              <Button
                variant={primary ? "primary" : "secondary"}
                block
                onClick={() => onCheckout(p.plan)}
                loading={pending === p.plan}
                loadingText="Abrindo"
              >
                {current ? SWITCH[p.plan] : SUBSCRIBE[p.plan]}
              </Button>
            }
          />
        );
      })}
    </PlansGrid>
  );
}
