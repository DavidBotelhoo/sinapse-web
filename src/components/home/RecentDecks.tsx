import Link from "next/link";
import { ArrowRight, Clock, Layers, Star, Users } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { ProgressBar } from "@/components/ui/StatCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { components } from "@/lib/api/schema";
import { cardsLabel } from "@/components/study/format";
import { cn } from "@/lib/cn";
import { relativeStudied } from "./dates";

type DeckListItem = components["schemas"]["DeckListItemDto"];

const stack =
  "shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line)] " +
  "hover:-translate-y-[2px] hover:shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line),var(--sn-shadow-md)]";

function RecentDeckCard({
  deck,
  today,
  timeZone,
  className,
}: {
  deck: DeckListItem;
  today: string;
  timeZone: string;
  className?: string;
}) {
  const subject = deck.subjects[0];
  const more = deck.subjects.length - 1;
  // Deck da comunidade mostra o dono; o próprio, quando foi estudado.
  const second = deck.isMine
    ? deck.lastStudiedAt
      ? { icon: Clock, text: relativeStudied(deck.lastStudiedAt, today, timeZone) }
      : null
    : deck.owner
      ? { icon: Users, text: `por ${deck.owner.firstName}` }
      : null;

  return (
    <Link
      href={`/flashcards/${deck.id}`}
      className={cn(
        "relative grid content-start gap-3 mt-4 p-5 rounded-lg border border-line bg-surface text-inherit no-underline",
        "transition-[transform,box-shadow] duration-(--dur-base) ease-out",
        stack,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-[6px]">
          <Tag>{deck.year}º ano</Tag>
          {subject ? <Tag tone="brand">{subject.name}</Tag> : null}
          {more > 0 ? <Tag>+{more}</Tag> : null}
        </div>
        {deck.isFavorite ? (
          <span className="grid place-items-center size-control-sm -m-2 text-accent-ink [&_svg]:size-5">
            <Star aria-hidden strokeWidth={1.75} fill="currentColor" />
            <span className="sr-only">Favorito</span>
          </span>
        ) : null}
      </div>
      <h3 className="m-0 font-display font-semibold text-[18px] leading-6 text-ink text-balance line-clamp-3">
        {deck.name}
      </h3>
      <div className="flex flex-wrap gap-x-3 gap-y-1 font-sans font-medium text-[13px] leading-[18px] text-ink-muted [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 [&_svg]:size-[15px] max-md:[&_svg]:hidden">
        <span>
          <Layers aria-hidden strokeWidth={1.75} />
          {cardsLabel(deck.cardCount)}
        </span>
        {second ? (
          <span>
            <second.icon aria-hidden strokeWidth={1.75} />
            {second.text}
          </span>
        ) : null}
        <span className="max-md:hidden! tabular-nums">{deck.masteryPct}% dominado</span>
      </div>
      <ProgressBar value={deck.masteryPct} label={`${deck.masteryPct}% dominado`} className="md:mt-1" />
    </Link>
  );
}

/** "Últimos decks estudados": 2×2 no desktop, carrossel no celular. */
export function RecentDecks({
  decks,
  today,
  timeZone,
}: {
  decks: ReadonlyArray<DeckListItem>;
  today: string;
  timeZone: string;
}) {
  if (decks.length === 0) return null;
  return (
    <section aria-labelledby="home-recentes" className="flex flex-col gap-1 md:gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="home-recentes"
          className="m-0 font-display font-semibold text-[20px] leading-[26px] md:text-[22px] md:leading-7 text-ink"
        >
          Últimos decks estudados
        </h2>
        <ButtonLink
          href="/flashcards"
          variant="ghost"
          size="sm"
          className="max-md:px-2 [&_svg]:size-[18px]"
        >
          Ver todos
          <ArrowRight aria-hidden strokeWidth={1.75} className="max-md:hidden" />
        </ButtonLink>
      </div>
      <div
        className={cn(
          "md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-6",
          "max-md:flex max-md:gap-3 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:scroll-px-4",
          "max-md:-mx-4 max-md:px-4 max-md:pt-1 max-md:pb-2 max-md:[scrollbar-width:none]",
        )}
      >
        {decks.map((d) => (
          <RecentDeckCard
            key={d.id}
            deck={d}
            today={today}
            timeZone={timeZone}
            className="max-md:flex-[0_0_256px] max-md:snap-start"
          />
        ))}
      </div>
    </section>
  );
}
