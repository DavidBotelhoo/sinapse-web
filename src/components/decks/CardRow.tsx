"use client";

import { Pencil } from "lucide-react";
import { CardStatusPill } from "./CardStatusPill";
import type { CardItem } from "@/lib/api/cards";
import { cn } from "@/lib/cn";

export type CardRowProps = {
  index: number;
  card: Pick<CardItem, "question" | "answer"> & Partial<Pick<CardItem, "status" | "dueInDays">>;
  showAnswers: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
  className?: string;
};

/**
 * Uma linha da lista de cards (dk-row). Desktop: número, pergunta, resposta, situação e editar.
 * Celular: situação, pergunta e resposta empilhadas. Na prévia da Comunidade não há situação.
 */
export function CardRow({ index, card, showAnswers, canEdit, onEdit, className }: CardRowProps) {
  const status = card.status;
  return (
    <div
      className={cn(
        "grid items-start gap-x-3 gap-y-[6px] p-[14px] md:gap-4 md:px-4",
        // As colunas de situação e editar ficam mesmo vazias (prévia): pergunta e resposta alinham como na tela 23.
        "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_112px_36px]",
        className,
      )}
    >
      <span
        aria-hidden
        className="max-md:hidden md:col-start-1 md:row-start-1 font-sans font-bold text-[12px] leading-5 tabular-nums text-ink-faint"
      >
        {String(index).padStart(2, "0")}
      </span>

      {status ? (
        <span className="col-start-1 row-start-1 md:col-start-4 justify-self-start">
          <CardStatusPill status={status} dueInDays={card.dueInDays ?? null} />
        </span>
      ) : null}

      <span
        className={cn(
          "col-start-1 md:col-start-2 md:row-start-1 font-sans font-semibold text-[15px] leading-[22px] text-ink",
          status ? "row-start-2" : "row-start-1",
        )}
      >
        {card.question}
      </span>

      <span
        className={cn(
          "col-span-full md:col-span-1 md:col-start-3 md:row-start-1 font-sans text-[15px] leading-[22px] text-ink-muted",
          status ? "row-start-3" : "row-start-2",
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

      {canEdit && onEdit ? (
        <button
          type="button"
          aria-label="Editar card"
          onClick={onEdit}
          className={cn(
            "col-start-2 row-start-1 row-span-2 md:row-span-1 md:col-start-5 md:-mt-[6px]",
            "grid place-items-center size-control-sm rounded-full bg-transparent text-ink-muted cursor-pointer hover:bg-surface-2 hover:text-ink [&_svg]:size-5",
          )}
        >
          <Pencil aria-hidden strokeWidth={1.75} />
        </button>
      ) : null}
    </div>
  );
}
