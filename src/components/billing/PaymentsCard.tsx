"use client";

import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Invoice } from "@/lib/api/billing";
import { cn } from "@/lib/cn";
import { cardLabel, formatBRL, longDate } from "./format";
import { planName } from "./PlanOptions";

const STATUS: Record<Invoice["status"], { label: string; className: string }> = {
  PAID: { label: "Pago", className: "text-success" },
  FAILED: { label: "Recusado", className: "text-danger" },
  REFUNDED: { label: "Estornado", className: "text-ink-muted" },
};

export type PaymentsCardProps = {
  invoices: ReadonlyArray<Invoice>;
  timeZone: string;
  /** "Trocar cartão": só com assinatura paga (vai para o portal). */
  onChangeCard?: () => void;
  changingCard?: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

/** Pagamentos: o histórico de cobranças (pf-pay). */
export function PaymentsCard({
  invoices,
  timeZone,
  onChangeCard,
  changingCard,
  hasMore,
  loadingMore,
  onLoadMore,
}: PaymentsCardProps) {
  return (
    <section
      aria-labelledby="pf-pagamentos"
      className="flex flex-col gap-4 md:gap-5 p-5 md:p-6 rounded-xl border border-line bg-surface"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="pf-pagamentos" className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
          Pagamentos
        </h2>
        {onChangeCard ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangeCard}
            loading={changingCard}
            loadingText="Abrindo"
            iconLeft={<CreditCard aria-hidden strokeWidth={1.75} className="size-[18px]" />}
          >
            Trocar cartão
          </Button>
        ) : null}
      </div>
      <ul className="m-0 p-0 list-none">
        {invoices.map((inv, i) => {
          const status = STATUS[inv.status];
          const card = cardLabel(inv.paymentMethodLabel);
          return (
            <li
              key={inv.id}
              className={cn(
                "grid items-center gap-x-4 gap-y-1 py-3 font-sans font-medium text-[14px] leading-5 text-ink",
                "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto_auto]",
                i > 0 && "border-t border-line",
              )}
            >
              <span className="md:row-span-1 max-md:row-span-2">
                {longDate(inv.date, timeZone)}
                <small className="block font-sans font-medium text-[12px] leading-4 text-ink-muted">
                  {[planName(inv.plan), card].filter(Boolean).join(" · ")}
                </small>
              </span>
              <span className="tabular-nums text-right">{formatBRL(inv.amountCents)}</span>
              <span className={cn("font-semibold text-right max-md:col-start-2", status.className)}>{status.label}</span>
            </li>
          );
        })}
      </ul>
      {hasMore ? (
        <Button variant="ghost" size="sm" onClick={onLoadMore} loading={loadingMore} loadingText="Carregando" className="self-start">
          Carregar mais
        </Button>
      ) : null}
    </section>
  );
}
