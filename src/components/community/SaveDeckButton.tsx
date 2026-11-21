"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type SaveDeckButtonProps = {
  saved: boolean;
  onToggle: () => void;
  className?: string;
};

/** "Salvar deck" (secundário) e "Salvo" (ghost na cor primary), como na grade da Comunidade. */
export function SaveDeckButton({ saved, onToggle, className }: SaveDeckButtonProps) {
  return saved ? (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed
      aria-label="Salvo. Toque para remover dos seus flashcards"
      onClick={onToggle}
      iconLeft={<BookmarkCheck aria-hidden strokeWidth={1.75} className="size-[18px]" />}
      className={cn("text-primary!", className)}
    >
      Salvo
    </Button>
  ) : (
    <Button
      variant="secondary"
      size="sm"
      aria-pressed={false}
      onClick={onToggle}
      iconLeft={<Bookmark aria-hidden strokeWidth={1.75} className="size-[18px]" />}
      className={className}
    >
      Salvar deck
    </Button>
  );
}
