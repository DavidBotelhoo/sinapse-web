"use client";

import { StatusPill } from "@/components/decks/StatusPill";
import { SelectCheck } from "./SelectCheck";
import { cardsLabel, yearsLabel } from "./format";
import { cn } from "@/lib/cn";

export type TopicTileProps = {
  name: string;
  cardCount: number;
  years: ReadonlyArray<number>;
  dueToday: number;
  overdue: number;
  selected: boolean;
  onToggle: () => void;
};

/** Matéria selecionável da aba "Por tema" (st-tile). */
export function TopicTile({ name, cardCount, years, dueToday, overdue, selected, onToggle }: TopicTileProps) {
  const meta = [cardsLabel(cardCount), yearsLabel(years)].filter(Boolean).join(" · ");
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "relative flex flex-col items-start gap-2 p-[14px] md:p-4 rounded-lg border-[1.5px] text-left cursor-pointer",
        "font-sans text-ink",
        "transition-[border-color,background-color] duration-(--dur-fast) ease-out",
        selected ? "border-primary bg-primary-soft" : "border-line bg-surface hover:border-line-strong",
      )}
    >
      <SelectCheck checked={selected} className="absolute top-[14px] right-[14px] md:top-4 md:right-4" />
      <span className="pr-7 font-semibold text-[15px] md:text-[16px] leading-[22px]">{name}</span>
      <span className="font-medium text-[13px] leading-[18px] text-ink-muted">{meta}</span>
      <StatusPill kind="deck" dueToday={dueToday} overdue={overdue} onSelected={selected} />
    </button>
  );
}
