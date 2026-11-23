"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ReviewAgenda } from "@/components/ui/ReviewAgenda";
import { useAgenda, type Agenda } from "@/lib/api/stats";
import { useCreateSession } from "@/lib/api/study";
import { cardsLabel, num } from "@/components/study/format";
import { startSessionError } from "@/components/study/errors";
import { SubscriptionNotice } from "@/components/billing/SubscriptionNotice";
import { useAccessGate } from "@/components/billing/useAccessGate";
import { dayOfMonth, sinceLabel, weekdayLong, weekdayShort } from "./dates";

/** Agenda de revisão da Início, com a escolha do dia. */
export function AgendaCard({ initial }: { initial: Agenda }) {
  const router = useRouter();
  const today = initial.days[0]?.date ?? initial.date;
  const [date, setDate] = useState(initial.date);
  const agenda = useAgenda(initial, date);
  const create = useCreateSession();
  const [navigating, startNavigation] = useTransition();
  const gate = useAccessGate();
  const [askedWithoutAccess, setAskedWithoutAccess] = useState(false);

  const data = agenda.data ?? initial;
  // Enquanto o dia escolhido carrega, a lista anterior fica (placeholderData), mas o botão segue o dia escolhido.
  const showingDate = data.date;
  const isToday = date === today;
  const todayTotal = data.days[0]?.total ?? 0;

  const days = data.days.map((d, i) => {
    const label = i === 0 ? "Hoje" : weekdayShort(d.date);
    const prefix = i === 0 ? `Hoje, ${weekdayLong(d.date).toLowerCase()}` : weekdayLong(d.date);
    const count = d.total > 0 ? cardsLabel(d.total) : "nenhum card";
    return {
      key: d.date,
      label,
      date: dayOfMonth(d.date),
      load: d.total,
      ariaLabel: `${prefix} ${dayOfMonth(d.date)}, ${count}`,
    };
  });

  const items = data.decks.map((deck) => {
    const parts = [deck.subjects[0]?.name, `${deck.year}º ano`];
    if (deck.overdue > 0 && deck.overdueSince) parts.push(`atrasado desde ${sinceLabel(deck.overdueSince, today)}`);
    return {
      id: deck.id,
      name: deck.name,
      sub: parts.filter(Boolean).join(" · "),
      count: deck.total,
      overdue: deck.overdue > 0,
    };
  });

  function reviewToday() {
    // Sem assinatura ativa, o aviso aparece na hora do clique (e também se a API recusar).
    if (gate.blocked) return setAskedWithoutAccess(true);
    create.mutate(
      { mode: "today", order: "DUE_FIRST" },
      {
        onSuccess: (s) => startNavigation(() => router.push(`/estudar/sessao/${s.sessionId}`)),
        onError: (err) => gate.handle(err) && setAskedWithoutAccess(true),
      },
    );
  }

  const sessionError = create.isError ? startSessionError(create.error) : null;

  let action = null;
  if (isToday && todayTotal > 0) {
    action = (
      <div className="grid gap-2">
        <Button
          variant="primary"
          block
          onClick={reviewToday}
          loading={create.isPending || (create.isSuccess && navigating)}
          loadingText="Montando a sessão"
          iconLeft={<Play aria-hidden strokeWidth={1.75} className="size-5" />}
        >
          Revisar {todayTotal === 1 ? "o 1 de hoje" : `os ${num(todayTotal)} de hoje`}
        </Button>
        {askedWithoutAccess ? <SubscriptionNotice what="estudar" /> : null}
        {sessionError ? (
          <p role="alert" className="m-0 text-center font-semibold text-[13px] leading-[18px] text-danger">
            {sessionError}
          </p>
        ) : null}
      </div>
    );
  } else if (isToday) {
    action = (
      <ButtonLink href="/estudar" variant="secondary" block>
        Estudar algo novo
      </ButtonLink>
    );
  }

  return (
    <ReviewAgenda
      days={days}
      selectedKey={date}
      onSelect={setDate}
      weekTotal={data.total}
      items={items}
      busy={agenda.isFetching && showingDate !== date}
      emptyText={isToday ? "Nada para revisar hoje" : "Nenhum card para este dia."}
      action={action}
    />
  );
}
