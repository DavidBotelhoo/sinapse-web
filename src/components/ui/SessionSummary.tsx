import type { ReactNode } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/cn";

const CIRC = 326.7;

export type SessionCounts = {
  again: number;
  hard: number;
  easy: number;
};

export type SessionSummaryProps = {
  hitRate: number;
  counts: SessionCounts;
  title?: ReactNode;
  subtitle?: ReactNode;
  totalTime: string;
  avgPerCard: string;
  streak: { days: number; increased: boolean };
  primaryAction: ReactNode;
  secondaryAction?: ReactNode;
  toReview?: ReactNode;
  /** No celular, o card perde a borda e as ações ficam presas ao fundo da tela (tela 08). */
  mobileFullScreen?: boolean;
  className?: string;
};

export function SessionSummary({
  hitRate,
  counts,
  title = "Sessão concluída",
  subtitle,
  totalTime,
  avgPerCard,
  streak,
  primaryAction,
  secondaryAction,
  toReview,
  mobileFullScreen,
  className,
}: SessionSummaryProps) {
  const pct = Math.max(0, Math.min(100, Math.round(hitRate)));
  const dasharray = `${((pct / 100) * CIRC).toFixed(1)} ${CIRC}`;
  const total = counts.again + counts.hard + counts.easy;

  return (
    <section
      aria-labelledby="sn-sum-title"
      className={cn(
        "grid gap-6 w-full max-w-[560px] p-6 md:p-8 rounded-xl border border-line bg-surface",
        mobileFullScreen && "max-md:pt-6 max-md:px-0 max-md:pb-0 max-md:border-0 max-md:bg-transparent",
        className,
      )}
    >
      <div className="flex items-center gap-6 max-md:flex-col max-md:text-center">
        <div className="relative size-28 shrink-0" role="img" aria-label={`${pct}% de acerto`}>
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth={10} className="stroke-surface-2" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={dasharray}
              className="stroke-primary transition-[stroke-dasharray] duration-(--dur-slow) ease-out"
            />
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center" aria-hidden>
            <b className="font-display font-bold text-[28px] leading-[30px] tabular-nums text-ink">
              {pct}%
            </b>
            <span className="font-sans font-medium text-[12px] leading-4 text-ink-muted">
              de acerto
            </span>
          </div>
        </div>
        <div>
          <h2 id="sn-sum-title" className="m-0 mb-1 font-display text-title-1 text-ink">
            {title}
          </h2>
          {subtitle ? <p className="m-0 text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>

      {total > 0 ? (
        <div className="grid gap-3">
          <div className="flex gap-[3px] h-3" aria-hidden>
            {counts.again > 0 ? (
              <span style={{ flex: `${counts.again} 1 0` }} className="rounded-[4px] bg-again" />
            ) : null}
            {counts.hard > 0 ? (
              <span style={{ flex: `${counts.hard} 1 0` }} className="rounded-[4px] bg-hard" />
            ) : null}
            {counts.easy > 0 ? (
              <span style={{ flex: `${counts.easy} 1 0` }} className="rounded-[4px] bg-easy" />
            ) : null}
          </div>
          <ul className="grid grid-cols-3 gap-2 m-0 p-0 list-none">
            <LegendItem dotClass="bg-again" label="Errei" value={counts.again} />
            <LegendItem dotClass="bg-hard" label="Difícil" value={counts.hard} />
            <LegendItem dotClass="bg-easy" label="Fácil" value={counts.easy} />
          </ul>
        </div>
      ) : null}

      <dl className="grid grid-cols-3 gap-3 m-0">
        <Fact term="Tempo" value={totalTime} />
        <Fact term="Por card" value={avgPerCard} />
        <Fact
          term="Streak"
          value={
            <span
              className={cn(
                "inline-flex items-center gap-1",
                streak.increased && "text-accent-ink",
              )}
            >
              {streak.increased ? (
                <Flame aria-hidden strokeWidth={1.75} className="size-[18px]" />
              ) : null}
              {streak.days} {streak.days === 1 ? "dia" : "dias"}
            </span>
          }
        />
      </dl>

      {toReview ? <div>{toReview}</div> : null}

      <div
        className={cn(
          "grid grid-cols-2 gap-3 max-sm:grid-cols-1",
          mobileFullScreen &&
            "max-md:grid-cols-1 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-30 " +
              "max-md:px-4 max-md:pt-3 max-md:pb-[calc(env(safe-area-inset-bottom,0px)+28px)] " +
              "max-md:border-t max-md:border-line max-md:bg-bg",
        )}
      >
        {primaryAction}
        {secondaryAction}
      </div>
    </section>
  );
}

function Fact({ term, value }: { term: ReactNode; value: ReactNode }) {
  return (
    <div className="px-4 py-3 rounded-md bg-surface-2">
      <dt className="font-sans font-medium text-[12px] leading-4 text-ink-muted">{term}</dt>
      <dd className="m-0 mt-[2px] font-sans font-bold text-[17px] leading-6 tabular-nums text-ink whitespace-nowrap">
        {value}
      </dd>
    </div>
  );
}

function LegendItem({
  dotClass,
  label,
  value,
}: {
  dotClass: string;
  label: string;
  value: number;
}) {
  return (
    <li className="flex items-center gap-2 font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
      <span aria-hidden className={cn("size-[10px] shrink-0 rounded-[3px]", dotClass)} />
      {label}
      <b className="ml-auto font-bold tabular-nums text-ink">{value}</b>
    </li>
  );
}
