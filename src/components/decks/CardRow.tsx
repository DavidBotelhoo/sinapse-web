"use client";

import { Pencil } from "lucide-react";
import { CardStatusPill } from "./CardStatusPill";
import type { CardItem } from "@/lib/api/cards";
import { cn } from "@/lib/cn";

export type CardRowProps = {
  index: number;
  card: CardItem;
  showAnswers: boolean;
  canEdit: boolean;
  onEdit: () => void;
  className?: string;
};

export function CardRow({ index, card, showAnswers, canEdit, onEdit, className }: CardRowProps) {
  return (
    <div
      className={cn(
        "grid gap-x-3 gap-y-1 py-3 border-t border-line first:border-t-0",
        "grid-cols-[32px_minmax(0,1fr)_auto_auto]",
        "md:grid-cols-[40px_minmax(0,1.3fr)_minmax(0,1fr)_auto_auto]",
        "items-start",
        className,
      )}
    >
      <span
        className="font-display font-bold text-[14px] leading-6 tabular-nums text-ink-muted"
        aria-hidden
      >
        {String(index).padStart(2, "0")}
      </span>
      <span className="font-sans text-[15px] leading-[22px] text-ink">{card.question}</span>
      <span
        className={cn(
          "md:col-start-3 col-span-full md:col-span-1",
          "font-sans text-[15px] leading-[22px] text-ink-muted",
        )}
      >
        {showAnswers ? (
          card.answer
        ) : (
          <span aria-label="Resposta escondida" className="inline-flex gap-1">
            <span className="inline-block h-3 w-16 rounded-sm bg-surface-2" />
            <span className="inline-block h-3 w-28 rounded-sm bg-surface-2" />
          </span>
        )}
      </span>
      <CardStatusPill status={card.status} dueInDays={card.dueInDays} className="md:col-start-4" />
      {canEdit ? (
        <button
          type="button"
          aria-label="Editar card"
          onClick={onEdit}
          className="grid place-items-center size-control-sm rounded-full bg-transparent text-ink-muted cursor-pointer hover:bg-surface-2 hover:text-ink [&_svg]:size-5"
        >
          <Pencil aria-hidden strokeWidth={1.75} />
        </button>
      ) : (
        <span className="w-9 h-9" aria-hidden />
      )}
    </div>
  );
}
