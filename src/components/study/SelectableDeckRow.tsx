"use client";

import { StatusPill } from "@/components/decks/StatusPill";
import { Tag } from "@/components/ui/Tag";
import { SelectCheck } from "./SelectCheck";
import { cardsLabel } from "./format";

export type SelectableDeckRowProps = {
  name: string;
  year: number;
  subjects: ReadonlyArray<{ id: string; name: string }>;
  cardCount: number;
  ownerFirstName?: string | null;
  dueToday: number;
  overdue: number;
  selected: boolean;
  onToggle: () => void;
};

/** Deck selecionável da aba "Por deck" (st-row). */
export function SelectableDeckRow({
  name,
  year,
  subjects,
  cardCount,
  ownerFirstName,
  dueToday,
  overdue,
  selected,
  onToggle,
}: SelectableDeckRowProps) {
  const shown = subjects.slice(0, 2);
  const more = subjects.length - shown.length;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className="flex items-center gap-[14px] w-full py-[14px] px-4 border-0 bg-transparent text-left text-ink cursor-pointer font-sans hover:bg-surface-2"
    >
      <SelectCheck checked={selected} />
      <span className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="font-semibold text-[15px] leading-5">{name}</span>
        <span className="flex flex-wrap items-center gap-[6px] font-medium text-[13px] leading-[18px] text-ink-muted">
          <Tag>{year}º ano</Tag>
          {shown.map((s) => (
            <Tag key={s.id} tone="brand">
              {s.name}
            </Tag>
          ))}
          {more > 0 ? <Tag>+{more}</Tag> : null}
          {cardsLabel(cardCount)}
          {ownerFirstName ? ` · por ${ownerFirstName}` : null}
        </span>
      </span>
      <StatusPill kind="deck" dueToday={dueToday} overdue={overdue} className="shrink-0" />
    </button>
  );
}
