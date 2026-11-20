"use client";

import { Flame, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { StudyToday } from "@/lib/api/study";
import { cardsLabel, num, plural } from "./format";

export type TodayReviewBannerProps = {
  today: StudyToday;
  onReview: () => void;
  loading?: boolean;
  error?: string | null;
};

/** "32 cards vencem hoje em 3 decks, cerca de 20 minutos. 5 estão atrasados." */
export function todaySentence(today: StudyToday) {
  const total = today.dueToday + today.overdue;
  if (total === 0) return "Nada vence hoje. Você está em dia.";
  const verb = plural(total, "vence", "vencem");
  const decks = `${num(today.deckCount)} ${plural(today.deckCount, "deck", "decks")}`;
  const minutes = Math.max(1, today.estimatedMinutes);
  let text = `${cardsLabel(total)} ${verb} hoje em ${decks}, cerca de ${num(minutes)} ${plural(minutes, "minuto", "minutos")}.`;
  if (today.overdue > 0) {
    text += ` ${num(today.overdue)} ${plural(today.overdue, "está atrasado", "estão atrasados")}.`;
  }
  return text;
}

/** Atalho "Revisão de hoje" no topo de /estudar (st-hero). */
export function TodayReviewBanner({ today, onReview, loading, error }: TodayReviewBannerProps) {
  const total = today.dueToday + today.overdue;
  return (
    <section
      aria-labelledby="st-hoje"
      className="flex flex-wrap items-center gap-5 p-6 rounded-xl bg-primary text-on-primary"
    >
      <span
        aria-hidden
        className="grid place-items-center size-[52px] shrink-0 rounded-full bg-on-primary/14 [&_svg]:size-6"
      >
        <Flame strokeWidth={1.75} />
      </span>
      <div className="flex-[1_1_260px] min-w-0">
        <h2 id="st-hoje" className="m-0 font-display font-bold text-[22px] leading-7">
          Revisão de hoje
        </h2>
        <p className="m-0 mt-[2px] opacity-85">{todaySentence(today)}</p>
        {error ? (
          <p role="alert" className="m-0 mt-2 font-semibold">
            {error}
          </p>
        ) : null}
      </div>
      {total > 0 ? (
        <Button
          variant="secondary"
          size="lg"
          onClick={onReview}
          loading={loading}
          loadingText="Montando a sessão"
          iconLeft={<Play aria-hidden strokeWidth={1.75} className="size-5" />}
          className="max-md:w-full"
        >
          Revisar agora
        </Button>
      ) : null}
    </section>
  );
}
