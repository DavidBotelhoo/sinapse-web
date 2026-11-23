"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Layers } from "lucide-react";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import {
  useCreateSession,
  type SessionLimit,
  type SessionOrder,
  type StudyOverview,
} from "@/lib/api/study";
import { TodayReviewBanner } from "./TodayReviewBanner";
import { TopicTile } from "./TopicTile";
import { SelectableDeckRow } from "./SelectableDeckRow";
import { SessionPanel } from "./SessionPanel";
import { SessionOptions } from "./SessionOptions";
import { MobileSessionBar } from "./MobileSessionBar";
import { estimateSession } from "./sessionEstimate";
import { approxMinutes, cardsLabel, plural } from "./format";
import { startSessionError } from "./errors";
import { SubscriptionNotice } from "@/components/billing/SubscriptionNotice";
import { useAccessGate } from "@/components/billing/useAccessGate";

type Tab = "subjects" | "decks";

function toggle(list: ReadonlyArray<string>, id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function StudyPicker({ overview }: { overview: StudyOverview }) {
  const router = useRouter();
  const [navigating, startNavigation] = useTransition();
  const [tab, setTab] = useState<Tab>("subjects");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [deckIds, setDeckIds] = useState<string[]>([]);
  const [limit, setLimit] = useState<SessionLimit>(20);
  const [order, setOrder] = useState<SessionOrder>("DUE_FIRST");
  const today = useCreateSession();
  const custom = useCreateSession();
  // Sem assinatura ativa: aviso no topo e os botões de começar levam para a aba Assinatura.
  const gate = useAccessGate();

  const selected = useMemo(
    () =>
      tab === "subjects"
        ? overview.subjects.filter((s) => subjectIds.includes(s.id))
        : overview.decks.filter((d) => deckIds.includes(d.id)),
    [tab, overview, subjectIds, deckIds],
  );
  const estimate = estimateSession(selected, limit);
  const timeLabel = approxMinutes(estimate.cards, overview.secondsPerCard);
  const count = selected.length;
  const selectionLabel =
    count === 0
      ? null
      : tab === "subjects"
        ? `${count} ${plural(count, "tema", "temas")}`
        : `${count} ${plural(count, "deck", "decks")}`;
  const canStart = count > 0 && estimate.cards > 0;
  const blockedLabel = count === 0 ? "Escolha o que estudar" : "Nada para estudar aqui";
  const startLabel = canStart ? `Começar sessão · ${cardsLabel(estimate.cards)}` : blockedLabel;

  function go(sessionId: string) {
    startNavigation(() => router.push(`/estudar/sessao/${sessionId}`));
  }

  function startToday() {
    if (gate.blocked) return router.push("/perfil/assinatura");
    custom.reset();
    today.mutate(
      { mode: "today", order: "DUE_FIRST" },
      { onSuccess: (s) => go(s.sessionId), onError: gate.handle },
    );
  }

  function startCustom() {
    if (!canStart) return;
    if (gate.blocked) return router.push("/perfil/assinatura");
    today.reset();
    custom.mutate(
      {
        ...(tab === "subjects" ? { subjectIds } : { deckIds }),
        limit,
        order,
      },
      { onSuccess: (s) => go(s.sessionId), onError: gate.handle },
    );
  }

  function remove(id: string) {
    if (tab === "subjects") setSubjectIds((l) => l.filter((x) => x !== id));
    else setDeckIds((l) => l.filter((x) => x !== id));
  }

  const customBusy = custom.isPending || (custom.isSuccess && navigating);
  const customError = custom.isError ? startSessionError(custom.error) : null;
  const options = (
    <SessionOptions limit={limit} onLimitChange={setLimit} order={order} onOrderChange={setOrder} />
  );

  return (
    <div className="grid gap-7 md:gap-8">
      <header className="grid gap-1">
        <h1 className="m-0 font-display text-title-1 text-ink">Estudar</h1>
        <p className="m-0 text-ink-muted">
          Escolha o que revisar agora.
          <span className="max-md:hidden"> Os cards que vencem hoje entram primeiro.</span>
        </p>
      </header>

      {gate.blocked ? <SubscriptionNotice /> : null}

      <TodayReviewBanner
        today={overview.today}
        onReview={startToday}
        loading={today.isPending || (today.isSuccess && navigating)}
        error={today.isError ? startSessionError(today.error) : null}
      />

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="st-montar" className="flex-[2_1_560px] min-w-0 flex flex-col gap-4 md:gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
            <h2 id="st-montar" className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
              Monte sua sessão
            </h2>
            <SegmentedTabs<Tab>
              ariaLabel="Estudar por"
              variant="block"
              value={tab}
              onChange={setTab}
              className="md:inline-flex md:w-fit"
              items={[
                { value: "subjects", label: "Por tema", icon: <BookOpen aria-hidden strokeWidth={1.75} /> },
                { value: "decks", label: "Por deck", icon: <Layers aria-hidden strokeWidth={1.75} /> },
              ]}
            />
          </div>

          {tab === "subjects" ? (
            <div
              role="tabpanel"
              aria-label="Por tema"
              className="grid gap-3 grid-cols-2 md:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]"
            >
              {overview.subjects.map((s) => (
                <TopicTile
                  key={s.id}
                  name={s.name}
                  cardCount={s.cardCount}
                  years={s.years}
                  dueToday={s.dueToday}
                  overdue={s.overdue}
                  selected={subjectIds.includes(s.id)}
                  onToggle={() => setSubjectIds((l) => toggle(l, s.id))}
                />
              ))}
            </div>
          ) : (
            <ul
              role="tabpanel"
              aria-label="Por deck"
              className="m-0 p-0 list-none rounded-lg border border-line bg-surface overflow-hidden [&>li+li]:border-t [&>li+li]:border-line"
            >
              {overview.decks.map((d) => (
                <li key={d.id}>
                  <SelectableDeckRow
                    name={d.name}
                    year={d.year}
                    subjects={d.subjects}
                    cardCount={d.cardCount}
                    ownerFirstName={d.isMine ? null : d.owner?.firstName}
                    dueToday={d.dueToday}
                    overdue={d.overdue}
                    selected={deckIds.includes(d.id)}
                    onToggle={() => setDeckIds((l) => toggle(l, d.id))}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="md:hidden mt-1">{options}</div>
        </section>

        <div className="hidden md:block flex-[1_1_320px] min-w-0 sticky top-6">
          <SessionPanel
            selectionLabel={selectionLabel}
            selected={selected}
            onRemove={remove}
            cards={estimate.cards}
            pending={estimate.pending}
            timeLabel={timeLabel}
            startLabel={startLabel}
            canStart={canStart}
            starting={customBusy}
            onStart={startCustom}
            error={customError}
            options={options}
          />
        </div>
      </div>

      <MobileSessionBar
        className="md:hidden"
        summary={selectionLabel ? `${selectionLabel} · ${cardsLabel(estimate.cards)}` : "Nada selecionado"}
        timeLabel={timeLabel}
        startLabel={canStart ? "Começar sessão" : blockedLabel}
        canStart={canStart}
        starting={customBusy}
        onStart={startCustom}
        error={customError}
      />
    </div>
  );
}
