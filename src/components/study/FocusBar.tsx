"use client";

import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type StudyProgressProps = {
  /** Posição do card atual, a partir de 1. */
  position: number;
  total: number;
  /** Cards já avaliados (a barra anda depois de avaliar). */
  done: number;
  className?: string;
};

/** "3 / 20" e a barra de progresso (sn-study__bar). */
export function StudyProgress({ position, total, done, className }: StudyProgressProps) {
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted",
        className,
      )}
    >
      <span className="tabular-nums" aria-label={`Card ${position} de ${total}`}>
        {position} / {total}
      </span>
      <div
        role="progressbar"
        aria-label="Progresso da sessão"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="relative flex-1 h-[6px] rounded-sm bg-surface-2 overflow-hidden"
      >
        <span
          style={{ width: `${pct}%` }}
          className="block h-full rounded-[inherit] bg-primary transition-[width] duration-(--dur-slow) ease-out"
        />
      </div>
    </div>
  );
}

function SessionClock({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-[6px] font-sans font-semibold text-[14px] leading-5 text-ink-muted tabular-nums [&_svg]:size-4"
      aria-label={`Tempo de sessão ${label}`}
    >
      <Clock aria-hidden strokeWidth={1.75} />
      {label}
    </span>
  );
}

export type FocusBarProps = {
  title: string;
  subtitle: string;
  timeLabel: string;
  onExit: () => void;
  /** No celular, o resumo só tem o X (fecha e volta ao início). */
  mobile:
    | { kind: "study"; position: number; total: number; done: number }
    | { kind: "summary"; onClose: () => void };
};

/** Barra de foco da sessão: Sair, título e tempo (ss-top); no celular, X, progresso e tempo. */
export function FocusBar({ title, subtitle, timeLabel, onExit, mobile }: FocusBarProps) {
  return (
    <>
      <header className="hidden md:flex items-center gap-4 py-[14px] px-8 border-b border-line bg-surface">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          iconLeft={<X aria-hidden strokeWidth={1.75} className="size-5" />}
        >
          Sair
        </Button>
        <div className="flex-1 min-w-0 flex flex-col items-center text-center font-sans">
          <h1 className="m-0 font-semibold text-[15px] leading-5 text-ink">{title}</h1>
          <span className="font-medium text-[13px] leading-[18px] text-ink-muted">{subtitle}</span>
        </div>
        <SessionClock label={timeLabel} />
      </header>

      <header className="md:hidden flex items-center gap-3 pt-3 px-4 pb-2">
        {/* No celular o título não aparece; o h1 continua para quem navega por títulos. */}
        <h1 className="sr-only">{title}</h1>
        {mobile.kind === "study" ? (
          <>
            <IconExit label="Sair da sessão" onClick={onExit} />
            <StudyProgress
              className="flex-1"
              position={mobile.position}
              total={mobile.total}
              done={mobile.done}
            />
            <SessionClock label={timeLabel} />
          </>
        ) : (
          <IconExit label="Fechar e voltar ao início" onClick={mobile.onClose} />
        )}
      </header>
    </>
  );
}

function IconExit({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid place-items-center size-control-sm shrink-0 rounded-full bg-transparent text-ink cursor-pointer hover:bg-surface-2 [&_svg]:size-5"
    >
      <X aria-hidden strokeWidth={1.75} />
    </button>
  );
}
