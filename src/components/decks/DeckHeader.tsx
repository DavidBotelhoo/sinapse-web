"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Globe, Layers, Lock, Play, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import type { DeckDetail } from "@/lib/api/decks";
import { cn } from "@/lib/cn";

export type DeckHeaderProps = {
  deck: DeckDetail;
  onToggleFavorite: () => void;
  onToggleSaved?: () => void;
  onStudy: () => void;
  menu: React.ReactNode;
};

export function DeckHeader({
  deck,
  onToggleFavorite,
  onToggleSaved,
  onStudy,
  menu,
}: DeckHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <Link
        href="/flashcards"
        className="inline-flex items-center gap-1 h-control-sm px-3 -ml-3 self-start rounded-md text-ink-muted font-sans font-semibold text-[14px] leading-none no-underline hover:bg-surface-2 hover:text-ink [&_svg]:size-[18px]"
      >
        <ArrowLeft aria-hidden strokeWidth={1.75} />
        Flashcards
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex-1 min-w-0 flex flex-col gap-[10px]">
          <div className="flex flex-wrap gap-[6px]">
            <Tag>{deck.year}º ano</Tag>
            {deck.subjects.map((s) => (
              <Tag key={s.id} tone="brand">
                {s.name}
              </Tag>
            ))}
          </div>
          <h1 className="m-0 font-display font-bold text-[32px] leading-[38px] tracking-[-0.01em] text-ink text-balance">
            {deck.name}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans font-medium text-[13px] leading-[18px] text-ink-muted [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 [&_svg]:size-[15px]">
            <span>
              <Layers aria-hidden strokeWidth={1.75} />
              {deck.cardCount} cards
            </span>
            {deck.isMine && deck.visibility === "PRIVATE" ? (
              <span>
                <Lock aria-hidden strokeWidth={1.75} /> Privado
              </span>
            ) : null}
            {deck.isMine && deck.visibility === "PUBLIC" ? (
              <span>
                <Globe aria-hidden strokeWidth={1.75} /> Público na Comunidade
              </span>
            ) : null}
            {!deck.isMine ? (
              <>
                <span>
                  <Avatar name={deck.owner.firstName} src={deck.owner.avatarUrl ?? undefined} size="xs" decorative />
                  por <b className="text-ink font-semibold ml-[2px]">{deck.owner.firstName}</b>
                </span>
                <span>
                  <Bookmark aria-hidden strokeWidth={1.75} /> {deck.saveCount} salvaram
                </span>
              </>
            ) : null}
            <span>
              <Clock aria-hidden strokeWidth={1.75} />
              Atualizado {formatRelative(deck.contentUpdatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" onClick={onStudy} iconLeft={<Play strokeWidth={1.75} className="size-[18px]" />}>
            Estudar este deck
          </Button>
          <Button
            variant="secondary"
            iconOnly
            aria-label={deck.isFavorite ? "Tirar dos favoritos" : "Favoritar"}
            aria-pressed={deck.isFavorite}
            onClick={onToggleFavorite}
            className={cn(deck.isFavorite && "text-accent-ink")}
          >
            <Star aria-hidden strokeWidth={1.75} fill={deck.isFavorite ? "currentColor" : "none"} className="size-[18px]" />
          </Button>
          {onToggleSaved ? (
            <Button
              variant={deck.isSaved ? "secondary" : "primary"}
              iconLeft={
                deck.isSaved ? (
                  <BookmarkCheck strokeWidth={1.75} className="size-[18px]" />
                ) : (
                  <Bookmark strokeWidth={1.75} className="size-[18px]" />
                )
              }
              onClick={onToggleSaved}
            >
              {deck.isSaved ? "Salvo" : "Salvar deck"}
            </Button>
          ) : null}
          {menu}
        </div>
      </div>
    </header>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "há algum tempo";
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;
  const years = Math.floor(months / 12);
  return `há ${years} ${years === 1 ? "ano" : "anos"}`;
}
