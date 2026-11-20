"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Tag } from "./Tag";
import { cn } from "@/lib/cn";

/** Acima disso o texto vira Figtree `body-lg` para não virar um muro (README do Flashcard). */
export const LONG_TEXT_CHARS = 110;

function isLong(node: ReactNode, force?: boolean) {
  if (force !== undefined) return force;
  return typeof node === "string" && node.length > LONG_TEXT_CHARS;
}

export type FlashcardProps = {
  question: ReactNode;
  answer: ReactNode;
  subject?: string;
  year?: string;
  flipped: boolean;
  onFlip: () => void;
  /** Força o estilo de texto longo na resposta. Sem isso, decide pelo tamanho do texto. */
  longAnswer?: boolean;
  /** Foca o card ao montar (o próximo card da sessão). */
  autoFocus?: boolean;
  className?: string;
  /** Altura mínima do card (padrão `min-h-80`). */
  innerClassName?: string;
};

export function Flashcard({
  question,
  answer,
  subject,
  year,
  flipped,
  onFlip,
  longAnswer,
  autoFocus,
  className,
  innerClassName,
}: FlashcardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    if (flipped) ref.current?.focus({ preventScroll: true });
  }, [flipped]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!e.repeat) onFlip();
    }
  }

  const meta = [subject, year].filter(Boolean).join(" · ");
  const textBase = "m-0 flex-1 flex items-center text-ink text-pretty";
  const textShort = "font-display font-semibold text-card-question";
  const textLong = "font-sans font-normal text-body-lg";

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={flipped ? "Resposta do flashcard" : "Flashcard. Toque para ver a resposta."}
      aria-pressed={flipped}
      onClick={onFlip}
      onKeyDown={onKeyDown}
      data-flipped={flipped}
      className={cn("group relative cursor-pointer select-none rounded-xl [perspective:1600px]", className)}
    >
      <div
        className={cn(
          "relative grid h-full min-h-80 transition-transform duration-(--dur-slow) ease-out",
          "[transform-style:preserve-3d]",
          "group-data-[flipped=true]:[transform:rotateY(180deg)] motion-reduce:transform-none!",
          innerClassName,
        )}
      >
        <Face side="front" flipped={flipped}>
          <div className="flex items-center justify-between gap-2 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
            <span>{meta}</span>
            <Tag>Pergunta</Tag>
          </div>
          <p className={cn(textBase, isLong(question) ? textLong : textShort)}>{question}</p>
          <p className="m-0 text-center font-sans font-medium text-[12px] leading-4 text-ink-muted">
            <span className="[@media(hover:none)]:hidden">
              Pense na resposta. Depois clique no card ou aperte Espaço.
            </span>
            <span className="hidden [@media(hover:none)]:inline">
              Pense na resposta. Depois toque no card.
            </span>
          </p>
        </Face>
        <Face side="back" flipped={flipped}>
          <div className="flex items-center justify-between gap-2 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
            <span className="inline-flex items-center gap-[6px] text-primary [&_svg]:size-4">
              <Sparkles aria-hidden strokeWidth={1.75} />
              Resposta
            </span>
            {meta ? <span>{meta}</span> : null}
          </div>
          <p className="m-0 pb-4 border-b border-line font-sans font-medium text-[14px] leading-5 text-ink-muted">
            {question}
          </p>
          {/* Sempre no DOM: a altura do card não muda ao virar. */}
          <p className={cn(textBase, isLong(answer, longAnswer) ? textLong : textShort)}>{answer}</p>
        </Face>
      </div>
      <span className="sr-only" aria-live="polite">
        {flipped ? answer : null}
      </span>
    </div>
  );
}

function Face({
  side,
  flipped,
  children,
}: {
  side: "front" | "back";
  flipped: boolean;
  children: ReactNode;
}) {
  const isBack = side === "back";
  const visible = isBack ? flipped : !flipped;
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "col-start-1 row-start-1 flex flex-col gap-4 p-6 md:p-8 rounded-xl border border-line bg-surface shadow-md",
        "[backface-visibility:hidden]",
        isBack && "[transform:rotateY(180deg)]",
        // Movimento reduzido: sem giro, as faces trocam por opacidade.
        "motion-reduce:[backface-visibility:visible] motion-reduce:transition-opacity motion-reduce:duration-(--dur-base) motion-reduce:ease-linear",
        isBack && "motion-reduce:[transform:none]",
        visible ? "motion-reduce:opacity-100" : "motion-reduce:opacity-0",
      )}
    >
      {children}
    </div>
  );
}

export type SessionBarProps = {
  position: string;
  progress: number;
  timeLabel?: string;
  onExit?: () => void;
  className?: string;
};

export function SessionBar({ position, progress, timeLabel, onExit, className }: SessionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted",
        className,
      )}
    >
      {onExit ? (
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1 h-control-sm px-3 rounded-sm bg-transparent text-ink-muted hover:text-ink hover:bg-surface-2 cursor-pointer"
        >
          Sair
        </button>
      ) : null}
      <span className="tabular-nums">{position}</span>
      <div className="relative flex-1 h-[6px] rounded-sm bg-surface-2 overflow-hidden" aria-hidden>
        <span
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          className="block h-full rounded-[inherit] bg-primary transition-[width] duration-(--dur-slow) ease-out"
        />
      </div>
      {timeLabel ? <span className="tabular-nums">{timeLabel}</span> : null}
    </div>
  );
}
