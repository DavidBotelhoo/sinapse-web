"use client";

import { useState, type ReactNode } from "react";
import { Tag, CountPill } from "./Tag";
import { cn } from "@/lib/cn";

export type ReviewAgendaDay = {
  key: string;
  /** "Hoje", "Seg", "Ter"… */
  label: string;
  /** Dia do mês: "15". */
  date: string;
  load: number;
  /** "Hoje, domingo 15, 32 cards": a faixa visual abrevia. */
  ariaLabel: string;
};

export type ReviewAgendaItem = {
  id: string;
  name: string;
  sub: string;
  count: number;
  overdue?: boolean;
};

export type ReviewAgendaProps = {
  days: ReadonlyArray<ReviewAgendaDay>;
  selectedKey: string;
  onSelect: (key: string) => void;
  weekTotal: number;
  items: ReadonlyArray<ReviewAgendaItem>;
  /** Texto quando o dia escolhido não tem cards. */
  emptyText: ReactNode;
  /** Botão no fim: "Revisar os N de hoje" (só em Hoje) ou "Estudar algo novo". */
  action?: ReactNode;
  /** A lista do dia escolhido ainda está chegando. */
  busy?: boolean;
  /** No celular, quantos decks aparecem antes de "Ver todos". */
  mobileLimit?: number;
  titleId?: string;
  className?: string;
};

export function ReviewAgenda({
  days,
  selectedKey,
  onSelect,
  weekTotal,
  items,
  emptyText,
  action,
  busy,
  mobileLimit = 4,
  titleId = "sn-agenda-title",
  className,
}: ReviewAgendaProps) {
  const [expanded, setExpanded] = useState(false);
  const hiddenOnMobile = expanded ? 0 : Math.max(0, items.length - mobileLimit);

  return (
    <section
      aria-labelledby={titleId}
      className={cn("grid gap-4 p-4 md:p-5 rounded-lg border border-line bg-surface", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={titleId} className="m-0 font-display font-semibold text-[18px] leading-6 text-ink">
          Agenda de revisão
        </h2>
        <Tag tone="brand" className="tabular-nums">
          {weekTotal.toLocaleString("pt-BR")} na semana
        </Tag>
      </div>

      <ol className="grid grid-cols-7 gap-[2px] md:gap-1 m-0 p-0 list-none">
        {days.map((d) => {
          const pressed = d.key === selectedKey;
          return (
            <li key={d.key}>
              <button
                type="button"
                aria-pressed={pressed}
                aria-label={d.ariaLabel}
                onClick={() => {
                  setExpanded(false);
                  onSelect(d.key);
                }}
                className={cn(
                  "grid justify-items-center gap-[2px] w-full min-w-11 py-2 px-0 md:px-[2px] rounded-md border-0 cursor-pointer",
                  "font-sans font-semibold text-[12px] leading-4",
                  "transition-colors duration-(--dur-fast) ease-out",
                  pressed ? "bg-primary text-on-primary" : "bg-transparent text-ink-muted hover:bg-surface-2",
                )}
              >
                {d.label}
                <span
                  className={cn(
                    "font-display font-bold text-[18px] leading-6 tabular-nums",
                    pressed ? "text-inherit" : "text-ink",
                  )}
                >
                  {d.date}
                </span>
                <span className="tabular-nums">{d.load > 0 ? d.load : "–"}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div
        aria-busy={busy || undefined}
        className={cn("transition-opacity duration-(--dur-base) ease-out", busy && "opacity-60")}
      >
        {items.length > 0 ? (
          <ul className="grid gap-[2px] m-0 p-0 list-none">
            {items.map((it, i) => (
              <li
                key={it.id}
                className={cn(
                  "flex items-center gap-3 py-[10px] px-1 md:px-2 rounded-md hover:bg-surface-2",
                  i >= items.length - hiddenOnMobile && "max-md:hidden",
                )}
              >
                <div className="flex-1 min-w-0 grid">
                  <span className="font-sans font-semibold text-[15px] leading-[22px] text-ink overflow-hidden text-ellipsis whitespace-nowrap">
                    {it.name}
                  </span>
                  <span className="font-sans font-medium text-[12px] leading-4 text-ink-muted">{it.sub}</span>
                </div>
                <CountPill tone={it.overdue ? "accent" : "brand"}>{it.count}</CountPill>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 py-4 text-center text-ink-muted">{emptyText}</p>
        )}
        {hiddenOnMobile > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="md:hidden mt-1 w-full h-control-sm rounded-sm bg-transparent font-sans font-semibold text-[14px] text-ink hover:bg-surface-2 cursor-pointer"
          >
            Ver todos ({items.length})
          </button>
        ) : null}
      </div>

      {action}
    </section>
  );
}
