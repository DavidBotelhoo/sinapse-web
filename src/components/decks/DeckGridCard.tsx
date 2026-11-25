"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Globe, Layers, Lock, Star } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/StatCard";
import { StatusPill } from "./StatusPill";
import type { DeckListItem } from "@/lib/api/decks";
import { cn } from "@/lib/cn";

export type DeckGridCardProps = {
  deck: DeckListItem;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  className?: string;
};

const stack =
  "shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line)] " +
  "hover:-translate-y-[2px] hover:shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line),var(--sn-shadow-md)]";

const base =
  "relative grid content-start gap-3 mt-4 p-5 rounded-lg border border-line bg-surface " +
  "transition-[transform,box-shadow] duration-(--dur-base) ease-out";

export function DeckGridCard({ deck, onToggleFavorite, className }: DeckGridCardProps) {
  const shownSubjects = deck.subjects.slice(0, 3);
  const overflow = deck.subjects.length - shownSubjects.length;

  function onFavorite(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(deck.id, !deck.isFavorite);
  }

  const favLabel = deck.isFavorite ? "Tirar dos favoritos" : "Favoritar";

  return (
    <article className={cn(base, stack, className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-[6px]">
          <Tag>{formatYear(deck.year)}</Tag>
          {shownSubjects.map((s) => (
            <Tag key={s.id} tone="brand">
              {s.name}
            </Tag>
          ))}
          {overflow > 0 ? <Tag>+{overflow}</Tag> : null}
        </div>
        <button
          type="button"
          aria-label={favLabel}
          aria-pressed={deck.isFavorite}
          onClick={onFavorite}
          className={cn(
            "relative z-1 grid place-items-center size-control-sm rounded-full bg-transparent cursor-pointer",
            deck.isFavorite
              ? "text-accent-ink"
              : "text-ink-muted hover:text-ink hover:bg-surface-2",
            "[&_svg]:size-5",
          )}
        >
          <Star aria-hidden strokeWidth={1.75} fill={deck.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <h2 className="m-0 font-display font-semibold text-[18px] leading-6 text-ink text-balance line-clamp-2">
        <Link href={`/flashcards/${deck.id}`} className="text-inherit no-underline after:content-[''] after:absolute after:inset-0 after:rounded-[inherit]">
          {deck.name}
        </Link>
      </h2>
      <div className="flex flex-wrap gap-x-3 gap-y-1 font-sans font-medium text-[13px] leading-[18px] text-ink-muted [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 [&_svg]:size-[15px]">
        <span>
          <Layers aria-hidden strokeWidth={1.75} />
          {deck.cardCount} cards
        </span>
        {deck.isMine && deck.visibility === "PRIVATE" ? (
          <span>
            <Lock aria-hidden strokeWidth={1.75} />
            Privado
          </span>
        ) : null}
        {deck.isMine && deck.visibility === "PUBLIC" ? (
          <span>
            <Globe aria-hidden strokeWidth={1.75} />
            Público
          </span>
        ) : null}
        {!deck.isMine && deck.owner ? (
          <span>
            <Avatar name={deck.owner.firstName} src={deck.owner.avatarUrl ?? undefined} size="xs" decorative />
            por <b className="text-ink font-semibold ml-[2px]">{deck.owner.firstName}</b>
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2 mt-1">
        <StatusPill kind="deck" dueToday={deck.dueToday} overdue={deck.overdue} />
        <span className="font-sans font-semibold text-[12px] leading-4 text-ink-muted tabular-nums">
          {deck.masteryPct}% dominado
        </span>
      </div>
      <ProgressBar value={deck.masteryPct} label="Domínio" />
    </article>
  );
}

function formatYear(year: number) {
  return `${year}º ano`;
}
