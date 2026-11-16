"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Tag } from "./Tag";
import { cn } from "@/lib/cn";

export type FlashcardProps = {
  question: ReactNode;
  answer: ReactNode;
  subject?: string;
  year?: string;
  flipped: boolean;
  onFlip: () => void;
  longAnswer?: boolean;
  className?: string;
};

export function Flashcard({
  question,
  answer,
  subject,
  year,
  flipped,
  onFlip,
  longAnswer,
  className,
}: FlashcardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flipped) ref.current?.focus();
  }, [flipped]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onFlip();
    }
  }

  const meta = [subject, year].filter(Boolean).join(" · ");

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={flipped ? "Flashcard. Resposta visível." : "Flashcard. Toque para ver a resposta."}
      aria-pressed={flipped}
      onClick={onFlip}
      onKeyDown={onKeyDown}
      data-flipped={flipped}
      className={cn(
        "group relative cursor-pointer select-none",
        "[perspective:1600px]",
        className,
      )}
    >
      <div
        className={cn(
          "relative grid min-h-80 transition-transform duration-(--dur-slow) ease-out",
          "[transform-style:preserve-3d]",
          "data-[flipped=true]:[transform:rotateY(180deg)] motion-reduce:data-[flipped=true]:[transform:none]",
        )}
        data-flipped={flipped}
      >
        <Face side="front" flipped={flipped}>
          <div className="flex items-center justify-between gap-2 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
            <span>{meta}</span>
            <Tag>Pergunta</Tag>
          </div>
          <p
            className={cn(
              "m-0 flex-1 flex items-center font-display font-semibold text-card-question text-ink text-pretty",
              longAnswer && "font-sans font-normal text-body-lg",
            )}
          >
            {question}
          </p>
          <p className="m-0 text-center font-sans font-medium text-[12px] leading-4 text-ink-muted">
            Pense na resposta. Depois toque no card ou aperte Espaço.
          </p>
        </Face>
        <Face side="back" flipped={flipped}>
          <div className="font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
            <span className="inline-flex items-center gap-[6px] text-primary [&_svg]:size-4">
              <Sparkles aria-hidden strokeWidth={1.75} />
              Resposta
            </span>
          </div>
          <p className="m-0 pb-4 border-b border-line font-sans font-medium text-[14px] leading-5 text-ink-muted">
            {question}
          </p>
          <p
            className={cn(
              "m-0 flex-1 flex items-center font-display font-semibold text-card-question text-ink text-pretty",
              longAnswer && "font-sans font-normal text-body-lg",
            )}
            aria-live="polite"
          >
            {answer}
          </p>
        </Face>
      </div>
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
  return (
    <div
      className={cn(
        "col-start-1 row-start-1 flex flex-col gap-4 p-8 rounded-xl border border-line bg-surface shadow-md",
        "[backface-visibility:hidden]",
        isBack && "[transform:rotateY(180deg)]",
        // reduced motion fade swap
        "motion-reduce:[backface-visibility:visible] motion-reduce:transition-opacity motion-reduce:duration-(--dur-base)",
        isBack
          ? "motion-reduce:[transform:none] motion-reduce:opacity-0"
          : "motion-reduce:opacity-100",
        !isBack && flipped ? "motion-reduce:opacity-0" : "",
        isBack && flipped ? "motion-reduce:opacity-100" : "",
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
