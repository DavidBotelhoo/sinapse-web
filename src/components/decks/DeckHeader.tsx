"use client";

import { Bookmark, Clock, Globe, Layers, Lock, Play, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { DeckDetail } from "@/lib/api/decks";
import { cn } from "@/lib/cn";
import { DeckHeaderLayout, deckIconButtonClass } from "./DeckHeaderLayout";
import { formatRelative, savesLabel } from "./format";

export type DeckHeaderProps = {
  deck: DeckDetail;
  onToggleFavorite: () => void;
  onStudy: () => void;
  /** "Estudar este deck"; logo depois de salvar da Comunidade, "Estudar agora". */
  studyLabel?: string;
  studying?: boolean;
  menu: React.ReactNode;
};

/** Cabeçalho do deck meu ou salvo (telas 19 e 22). */
export function DeckHeader({
  deck,
  onToggleFavorite,
  onStudy,
  studyLabel = "Estudar este deck",
  studying,
  menu,
}: DeckHeaderProps) {
  return (
    <DeckHeaderLayout
      back={{ href: "/flashcards", label: "Flashcards" }}
      year={deck.year}
      subjects={deck.subjects}
      title={deck.name}
      meta={
        <>
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
                por <b>{deck.owner.firstName}</b>
              </span>
              <span>
                <Bookmark aria-hidden strokeWidth={1.75} /> {savesLabel(deck.saveCount)}
              </span>
            </>
          ) : null}
          <span>
            <Clock aria-hidden strokeWidth={1.75} />
            Atualizado {formatRelative(deck.contentUpdatedAt)}
          </span>
        </>
      }
      primary={
        <Button
          variant="primary"
          onClick={onStudy}
          loading={studying}
          loadingText="Montando a sessão"
          iconLeft={<Play aria-hidden strokeWidth={1.75} className="size-[18px]" />}
        >
          {studyLabel}
        </Button>
      }
      side={
        <>
          <Button
            variant="secondary"
            iconOnly
            aria-label={deck.isFavorite ? "Tirar dos favoritos" : "Favoritar"}
            aria-pressed={deck.isFavorite}
            onClick={onToggleFavorite}
            className={cn(deckIconButtonClass, deck.isFavorite && "text-accent-ink!")}
          >
            <Star aria-hidden strokeWidth={1.75} fill={deck.isFavorite ? "currentColor" : "none"} className="size-[18px]" />
          </Button>
          {menu}
        </>
      }
    />
  );
}
