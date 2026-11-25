"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { DeckGridCard } from "./DeckGridCard";
import type { DeckListItem } from "@/lib/api/decks";
import { cn } from "@/lib/cn";

export type DeckGridProps = {
  decks: ReadonlyArray<DeckListItem>;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  showNewCard?: boolean;
  className?: string;
};

export function DeckGrid({ decks, onToggleFavorite, showNewCard, className }: DeckGridProps) {
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-6 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]",
        className,
      )}
      aria-label="Decks"
    >
      {decks.map((deck) => (
        <DeckGridCard key={deck.id} deck={deck} onToggleFavorite={onToggleFavorite} />
      ))}
      {showNewCard ? (
        <Link
          href="/flashcards/novo"
          className={cn(
            // No celular o "Criar deck" fica só no cabeçalho (tela 10 celular).
            "hidden md:grid justify-items-center content-center gap-[6px] min-h-[196px] mt-4 p-5 rounded-lg text-center cursor-pointer no-underline",
            "border-[1.5px] border-dashed border-line-strong bg-transparent text-ink-muted",
            "hover:border-primary hover:bg-primary-soft hover:text-on-primary-soft",
          )}
        >
          <span
            aria-hidden
            className="grid place-items-center size-12 rounded-full bg-primary text-on-primary [&_svg]:size-6"
          >
            <Plus strokeWidth={1.75} />
          </span>
          <span className="font-sans font-semibold text-[15px] leading-[22px]">Criar novo deck</span>
          <small className="font-sans font-medium text-[12px] leading-4">Importe um PDF ou Word</small>
        </Link>
      ) : null}
    </div>
  );
}
