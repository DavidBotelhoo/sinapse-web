"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Layers } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Tag } from "@/components/ui/Tag";
import { savesLabel } from "@/components/decks/format";
import type { CommunityDeck } from "@/lib/api/community";
import { cn } from "@/lib/cn";
import { SaveDeckButton } from "./SaveDeckButton";

const stack =
  "shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line)] " +
  "hover:-translate-y-[2px] hover:shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line),var(--sn-shadow-md)]";

export type CommunityDeckCardProps = {
  deck: CommunityDeck;
  onToggleSave: (deck: CommunityDeck) => void;
};

/** Deck na grade da Comunidade (sn-deck): dono, "N salvaram" e Salvar/Salvo. */
export function CommunityDeckCard({ deck, onToggleSave }: CommunityDeckCardProps) {
  // Salvo ou próprio: abre a versão de Flashcards; os outros, a prévia.
  const href = deck.isMine || deck.isSaved ? `/flashcards/${deck.id}` : `/comunidade/${deck.id}`;

  return (
    <article
      className={cn(
        "relative grid content-start gap-3 mt-4 p-5 rounded-lg border border-line bg-surface",
        "transition-[transform,box-shadow] duration-(--dur-base) ease-out",
        stack,
      )}
    >
      <div className="flex flex-wrap gap-[6px]">
        <Tag>{deck.year}º ano</Tag>
        {deck.subjects.map((s) => (
          <Tag key={s.id} tone="brand">
            {s.name}
          </Tag>
        ))}
      </div>
      <h2 className="m-0 font-display font-semibold text-[18px] leading-6 text-ink text-balance">
        <Link
          href={href}
          className="text-inherit no-underline after:content-[''] after:absolute after:inset-0 after:rounded-[inherit]"
        >
          {deck.name}
        </Link>
      </h2>
      <div className="flex flex-wrap gap-x-3 gap-y-1 font-sans font-medium text-[13px] leading-[18px] text-ink-muted [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 [&_svg]:size-[15px]">
        <span>
          <Layers aria-hidden strokeWidth={1.75} />
          {deck.cardCount} cards
        </span>
        <span>
          <Bookmark aria-hidden strokeWidth={1.75} />
          {savesLabel(deck.saveCount)}
        </span>
      </div>
      {/* Sem quebra, como o sn-deck__foot: num card estreito o botão avança no padding (tela 17). */}
      <div className="flex items-center justify-between gap-3 mt-1">
        <span className="flex shrink-0 items-center gap-2 font-sans font-medium text-[13px] leading-[18px] text-ink-muted whitespace-nowrap">
          <Avatar name={deck.owner.firstName} src={deck.owner.avatarUrl ?? undefined} size="xs" decorative />
          por <b className="font-semibold text-ink">{deck.owner.firstName}</b>
        </span>
        {/* Acima do link que cobre o card. */}
        <span className="relative z-[1] shrink-0">
          {deck.isMine ? (
            <ButtonLink
              href={`/flashcards/${deck.id}`}
              variant="ghost"
              size="sm"
              className="[&_svg]:size-4"
            >
              Seu deck
              <ArrowRight aria-hidden strokeWidth={1.75} />
            </ButtonLink>
          ) : (
            <SaveDeckButton saved={deck.isSaved} onToggle={() => onToggleSave(deck)} />
          )}
        </span>
      </div>
    </article>
  );
}
