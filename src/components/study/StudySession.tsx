"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button, Kbd } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Flashcard } from "@/components/ui/Flashcard";
import { RatingButtons, type Rating } from "@/components/ui/RatingButtons";
import { SessionSummary } from "@/components/ui/SessionSummary";
import { isApiError } from "@/lib/api/base";
import {
  fetchSession,
  finishSession,
  postReview,
  useInvalidateStudyData,
  useRepeatSession,
  type ReviewInput,
  type ReviewRating,
  type SessionSummary as Summary,
  type StudyCard,
  type StudySession as Session,
} from "@/lib/api/study";
import { FocusBar, StudyProgress } from "./FocusBar";
import { ShortcutHint } from "./ShortcutHint";
import { ToReviewList } from "./ToReviewList";
import { cardsLabel, clockLabel, durationLabel, joinList, plural } from "./format";
import { startSessionError } from "./errors";
import { SubscriptionNotice } from "@/components/billing/SubscriptionNotice";
import { isSubscriptionRequired, useAccessGate } from "@/components/billing/useAccessGate";
import { useNow } from "./useNow";

const RATING: Record<Rating, ReviewRating> = { again: "AGAIN", hard: "HARD", easy: "GOOD" };
const INTERACTIVE = "button, a, input, textarea, select, [role='button'], [contenteditable='true']";

// "blocked": a assinatura venceu no meio da sessão (a API recusou a avaliação).
type Phase = "study" | "finishing" | "summary" | "error" | "blocked";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function subjectsLabel(subjects: ReadonlyArray<{ name: string }>) {
  const names = subjects.map((s) => s.name);
  if (names.length <= 3) return joinList(names);
  return `${names.slice(0, 2).join(", ")} e mais ${names.length - 2}`;
}

function cardMeta(card: { year: number; subjects: ReadonlyArray<{ name: string }> }) {
  return [card.subjects.map((s) => s.name).slice(0, 2).join(", "), `${card.year}º ano`]
    .filter(Boolean)
    .join(" · ");
}

export function StudySession({ session }: { session: Session }) {
  const router = useRouter();
  const invalidate = useInvalidateStudyData();
  const repeat = useRepeatSession();
  const [navigating, startNavigation] = useTransition();
  const gate = useAccessGate();
  const { handle: handleNoAccess } = gate;
  const lostAccess = useRef(false);
  const [askedWithoutAccess, setAskedWithoutAccess] = useState(false);
  const now = useNow();

  // A fila desta tela: os cards que ainda não foram avaliados (recarregar continua de onde parou).
  const [reviewedIds, setReviewedIds] = useState<ReadonlyArray<string>>(session.reviewedCardIds);
  const queue = useMemo<StudyCard[]>(() => {
    const done = new Set(reviewedIds);
    return session.cards.filter((c) => !done.has(c.id));
  }, [session.cards, reviewedIds]);
  const alreadyDone = session.cards.length - queue.length;

  const startsFinished = session.finishedAt !== null || queue.length === 0;
  const [phase, setPhase] = useState<Phase>(startsFinished ? "finishing" : "study");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const shownAt = useRef(0);
  const locked = useRef(false);
  const pending = useRef<Promise<void>>(Promise.resolve());
  const failed = useRef<ReviewInput[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);
  const touched = useRef(false);

  const card = phase === "study" ? queue[index] : undefined;
  const title = session.mode === "today" ? "Revisão de hoje" : "Sessão de estudo";
  const subtitle = [subjectsLabel(session.subjects), cardsLabel(session.total)].filter(Boolean).join(" · ");

  const goLogin = useCallback(() => {
    router.push(`/entrar?next=${encodeURIComponent(`/estudar/sessao/${session.sessionId}`)}`);
  }, [router, session.sessionId]);

  // Cada avaliação vai em série, em segundo plano; a tela já avançou.
  const send = useCallback(
    async (body: ReviewInput) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await postReview(session.sessionId, body);
          return;
        } catch (err) {
          if (isApiError(err)) {
            if (err.status === 401) return goLogin();
            if (isSubscriptionRequired(err)) {
              lostAccess.current = true;
              handleNoAccess(err);
              setPhase("blocked");
              return;
            }
            // Clique duplo, card apagado ou sessão já encerrada: nada a refazer.
            if (["CARD_ALREADY_REVIEWED", "CARD_NOT_FOUND", "STUDY_SESSION_FINISHED"].includes(err.code)) return;
            if (err.status < 500 && err.status !== 429) return;
          }
          await sleep(400 * 2 ** attempt);
        }
      }
      failed.current.push(body);
    },
    [session.sessionId, goLogin, handleNoAccess],
  );

  const finish = useCallback(async () => {
    await pending.current;
    if (lostAccess.current) return setPhase("blocked");
    const retry = failed.current.splice(0);
    for (const body of retry) await send(body);
    if (failed.current.length > 0) {
      const n = failed.current.length;
      setErrorText(
        `${n} ${plural(n, "avaliação não foi salva", "avaliações não foram salvas")}. Confira a conexão e tente de novo.`,
      );
      setPhase("error");
      return;
    }
    try {
      const result = await finishSession(session.sessionId);
      setSummary(result);
      setPhase("summary");
      invalidate();
    } catch (err) {
      if (isApiError(err) && err.status === 401) return goLogin();
      setErrorText("Não foi possível fechar a sessão. Tente de novo.");
      setPhase("error");
    }
  }, [send, session.sessionId, invalidate, goLogin]);

  // Ao abrir a tela (uma vez):
  // - sessão já encerrada ou sem cards pendentes: o finish pode ser chamado de novo e devolve o resumo;
  // - senão, confere a sessão na API. O voltar do navegador pode trazer a página guardada de antes,
  //   com a sessão ainda aberta; se quem estuda ainda não mexeu, a tela acompanha o estado real.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    if (startsFinished) {
      void finish();
      return;
    }
    void fetchSession(session.sessionId)
      .then((fresh) => {
        if (touched.current) return;
        const left = session.cards.filter((c) => !fresh.reviewedCardIds.includes(c.id));
        if (fresh.finishedAt !== null || left.length === 0) {
          setPhase("finishing");
          void finish();
        } else if (fresh.reviewedCardIds.length !== session.reviewedCardIds.length) {
          setReviewedIds(fresh.reviewedCardIds);
        }
      })
      .catch(() => {
        // Sem rede: segue com o que veio do servidor; as avaliações repetidas a API recusa sem estrago.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // O tempo do card começa quando a pergunta aparece.
  useEffect(() => {
    if (phase !== "study") return;
    shownAt.current = performance.now();
    locked.current = false;
  }, [phase, index]);

  useEffect(() => {
    if (phase === "summary") summaryRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const flip = useCallback(() => {
    if (phase !== "study") return;
    touched.current = true;
    setFlipped(true);
  }, [phase]);

  const rate = useCallback(
    (r: Rating) => {
      if (phase !== "study" || !flipped || !card || locked.current) return;
      locked.current = true;
      const body: ReviewInput = {
        cardId: card.id,
        rating: RATING[r],
        durationMs: Math.max(0, Math.round(performance.now() - shownAt.current)),
      };
      pending.current = pending.current.then(() => send(body));
      if (index + 1 >= queue.length) {
        setPhase("finishing");
        void finish();
      } else {
        setIndex(index + 1);
        setFlipped(false);
      }
    },
    [phase, flipped, card, index, queue.length, send, finish],
  );

  // Espaço ou Enter viram o card mesmo sem foco nele (o card e os botões tratam as próprias teclas).
  useEffect(() => {
    if (phase !== "study") return;
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key !== " " && e.key !== "Enter") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest(INTERACTIVE)) return;
      e.preventDefault();
      flip();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, flip]);

  async function exit() {
    await Promise.race([pending.current, sleep(1500)]);
    invalidate();
    router.push("/estudar");
  }

  function studyAgain() {
    if (gate.blocked) return setAskedWithoutAccess(true);
    repeat.mutate(session.sessionId, {
      onSuccess: (s) => startNavigation(() => router.push(`/estudar/sessao/${s.sessionId}`)),
      onError: (err) => gate.handle(err) && setAskedWithoutAccess(true),
    });
  }

  /** Sem acesso: fecha a sessão com o que já foi salvo e mostra o resumo. */
  function closeWithoutAccess() {
    lostAccess.current = false;
    retryFinish();
  }

  function retryFinish() {
    setErrorText(null);
    setPhase("finishing");
    void finish();
  }

  const startedAt = new Date(session.startedAt).getTime();
  const elapsed = summary
    ? new Date(summary.finishedAt).getTime() - new Date(summary.startedAt).getTime()
    : now === null
      ? null
      : now - startedAt;
  const timeLabel = elapsed === null ? "--:--" : clockLabel(elapsed);
  const done = alreadyDone + index;

  return (
    <>
      <FocusBar
        title={title}
        subtitle={subtitle}
        timeLabel={timeLabel}
        onExit={phase === "summary" ? () => router.push("/estudar") : exit}
        mobile={
          phase === "summary"
            ? { kind: "summary", onClose: () => router.push("/inicio") }
            : { kind: "study", position: Math.min(done + 1, session.total), total: session.total, done }
        }
      />

      {phase === "study" && card ? (
        <main className="flex-1 flex flex-col overflow-x-clip px-4 pt-2 md:px-8 md:pt-10 md:pb-14">
          <div className="flex-1 md:flex-none flex flex-col gap-5 w-full max-w-[640px] mx-auto">
            <StudyProgress className="hidden md:flex" position={done + 1} total={session.total} done={done} />

            <div
              key={card.id}
              className={
                index > 0
                  ? "animate-[sn-card-in_var(--dur-slow)_var(--ease-out)] motion-reduce:animate-[sn-fade-in_var(--dur-base)_linear]"
                  : undefined
              }
            >
              <Flashcard
                autoFocus
                question={card.question}
                answer={card.answer}
                subject={cardMeta(card)}
                flipped={flipped}
                onFlip={flip}
                innerClassName="min-h-[min(520px,calc(100dvh-200px))] md:min-h-[380px]"
              />
            </div>

            {/* "Mostrar resposta" e as avaliações ocupam o mesmo lugar, com a mesma altura. */}
            <div className="max-md:mt-auto max-md:sticky max-md:bottom-0 max-md:-mx-4 max-md:px-4 max-md:pt-3 max-md:pb-[calc(env(safe-area-inset-bottom,0px)+28px)] max-md:bg-bg">
              <div className="min-h-16 md:min-h-14">
                {flipped ? (
                  <RatingButtons onRate={rate} />
                ) : (
                  <Button variant="primary" size="lg" block onClick={flip} aria-keyshortcuts="Space">
                    Mostrar resposta
                    <span className="max-md:hidden inline-flex">
                      <Kbd>Espaço</Kbd>
                    </span>
                  </Button>
                )}
              </div>
            </div>

            <ShortcutHint />
          </div>
        </main>
      ) : null}

      {phase === "finishing" ? (
        <main className="flex-1 grid place-items-center p-8">
          <p role="status" className="m-0 text-ink-muted">
            Fechando a sessão…
          </p>
        </main>
      ) : null}

      {phase === "error" ? (
        <main className="flex-1 grid place-items-center p-8">
          <div className="grid justify-items-center gap-4 max-w-[420px] text-center">
            <p role="alert" className="m-0 text-ink">
              {errorText}
            </p>
            <Button variant="primary" onClick={retryFinish}>
              Tentar de novo
            </Button>
          </div>
        </main>
      ) : null}

      {phase === "blocked" ? (
        <main className="flex-1 grid place-items-center p-4 md:p-8">
          <div className="grid gap-4 w-full max-w-[560px]">
            <SubscriptionNotice what="estudar" />
            <p className="m-0 text-center text-ink-muted">As avaliações anteriores ficaram salvas.</p>
            <Button variant="secondary" className="justify-self-center" onClick={closeWithoutAccess}>
              Ver o resumo
            </Button>
          </div>
        </main>
      ) : null}

      {phase === "summary" && summary ? (
        <main className="flex-1 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+160px)] md:px-8 md:pt-10 md:pb-14">
          <div
            ref={summaryRef}
            tabIndex={-1}
            className="flex flex-col gap-4 md:gap-5 w-full max-w-[560px] mx-auto outline-none"
          >
            <SessionSummary
              mobileFullScreen
              hitRate={summary.accuracyPct ?? 0}
              counts={{ again: summary.counts.again, hard: summary.counts.hard, easy: summary.counts.good }}
              subtitle={summarySubtitle(summary)}
              totalTime={durationLabel(summary.totalDurationMs)}
              avgPerCard={summary.avgDurationMs === null ? "–" : durationLabel(summary.avgDurationMs)}
              streak={summary.streak}
              primaryAction={
                <Button
                  variant="primary"
                  onClick={studyAgain}
                  loading={repeat.isPending || (repeat.isSuccess && navigating)}
                  loadingText="Montando a sessão"
                  iconLeft={<RotateCcw aria-hidden strokeWidth={1.75} className="size-5" />}
                >
                  Estudar novamente
                </Button>
              }
              secondaryAction={
                <ButtonLink href="/estudar" variant="secondary">
                  Escolher novos temas
                </ButtonLink>
              }
            />
            {askedWithoutAccess ? <SubscriptionNotice what="estudar" /> : null}
            {repeat.isError && startSessionError(repeat.error) ? (
              <p role="alert" className="m-0 text-center font-semibold text-[13px] leading-[18px] text-danger">
                {startSessionError(repeat.error)}
              </p>
            ) : null}
            <ToReviewList
              items={summary.toReview.map((c) => ({
                id: c.id,
                question: c.question,
                meta: cardMeta(c),
                due: c.due,
              }))}
            />
            <ButtonLink
              href="/inicio"
              variant="ghost"
              className="self-center max-md:hidden"
              iconLeft={<ArrowLeft aria-hidden strokeWidth={1.75} />}
            >
              Voltar ao início
            </ButtonLink>
          </div>
        </main>
      ) : null}
    </>
  );
}

function summarySubtitle(s: Summary) {
  if (s.reviewed === 0) return "Nenhum card avaliado nesta sessão.";
  const right = s.counts.hard + s.counts.good;
  if ((s.accuracyPct ?? 0) >= 90) return `Mandou bem: ${right} de ${s.reviewed} de primeira.`;
  const minutes = Math.max(1, Math.round(s.totalDurationMs / 60_000));
  const subjects = s.subjects.length > 0 ? ` de ${subjectsLabel(s.subjects)}` : "";
  return `${cardsLabel(s.reviewed)}${subjects} em ${minutes} ${plural(minutes, "minuto", "minutos")}.`;
}
