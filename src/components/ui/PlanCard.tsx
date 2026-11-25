import type { ReactNode } from "react";
import { Check, CreditCard, Crown, TriangleAlert } from "lucide-react";
import { Tag } from "./Tag";
import { cn } from "@/lib/cn";

export type PlanStatus = "current" | "available" | "declined" | "none";

export type PlanCardProps = {
  name: string;
  /** Sem preço (API fora do ar), a linha do preço some. */
  priceLabel?: string;
  periodLabel: string;
  note?: ReactNode;
  highlights: ReadonlyArray<ReactNode>;
  status: PlanStatus;
  statusLine?: ReactNode;
  warningLine?: ReactNode;
  /** Selo de um plano que não é o atual ("2 meses grátis"). */
  badge?: ReactNode;
  /** Borda de destaque sem ser o plano atual (o anual da landing). */
  featured?: boolean;
  action: ReactNode;
  className?: string;
};

export function PlanCard({
  name,
  priceLabel,
  periodLabel,
  note,
  highlights,
  status,
  statusLine,
  warningLine,
  badge,
  featured = false,
  action,
  className,
}: PlanCardProps) {
  const isCurrent = status === "current" || status === "declined";
  const highlighted = isCurrent || featured;
  return (
    <section
      className={cn(
        "grid content-start gap-4 p-6 rounded-lg bg-surface",
        highlighted ? "border-2 border-primary p-[calc(1.5rem-1px)]" : "border border-line",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 font-display font-semibold text-[18px] leading-6 text-ink">{name}</h3>
        {/* Com pagamento recusado continua "Seu plano" (tela 27); o aviso vai no warningLine. */}
        {isCurrent ? (
          <Tag tone="accent" icon={<Crown strokeWidth={1.75} />}>
            Seu plano
          </Tag>
        ) : badge ? (
          badge
        ) : null}
      </div>
      {priceLabel ? (
        <div className="flex items-baseline gap-1">
          <b className="font-display font-bold text-[32px] leading-9 tracking-[-0.01em] tabular-nums text-ink">
            {priceLabel}
          </b>
          <span className="font-sans font-semibold text-ink-muted">{periodLabel}</span>
        </div>
      ) : null}
      {note ? (
        <p className="-mt-2 m-0 font-sans font-medium text-[12px] leading-4 text-ink-muted">{note}</p>
      ) : null}
      <ul className="grid gap-[10px] m-0 p-0 list-none">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-[10px] font-sans text-[15px] leading-[22px] text-ink">
            <Check strokeWidth={1.75} className="size-[18px] mt-[2px] text-primary" aria-hidden />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      {warningLine ? (
        <div className="flex items-center gap-2 px-3 py-3 rounded-md bg-warning-soft text-ink font-sans font-medium text-[13px] leading-[18px] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-warning">
          <TriangleAlert aria-hidden strokeWidth={1.75} />
          {warningLine}
        </div>
      ) : statusLine ? (
        <div className="flex items-center gap-2 px-3 py-3 rounded-md bg-surface-2 text-ink-muted font-sans font-medium text-[13px] leading-[18px] [&_svg]:size-4 [&_svg]:shrink-0">
          <CreditCard aria-hidden strokeWidth={1.75} />
          {statusLine}
        </div>
      ) : null}
      {action}
    </section>
  );
}

export function PlansGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
