"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type MobileSessionBarProps = {
  summary: string;
  timeLabel: string;
  startLabel: string;
  canStart: boolean;
  starting?: boolean;
  onStart: () => void;
  error?: string | null;
  className?: string;
};

/**
 * "Sua sessão" no celular: card preso ao fundo, acima da barra inferior e do play,
 * que sobe 26px. Fica no fim do conteúdo e gruda ao rolar (sticky).
 */
export function MobileSessionBar({
  summary,
  timeLabel,
  startLabel,
  canStart,
  starting,
  onStart,
  error,
  className,
}: MobileSessionBarProps) {
  return (
    <div
      className={cn(
        "sticky z-30 bottom-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom,0px)+34px)]",
        "-mx-2 flex flex-col gap-3 p-4 rounded-lg border border-line bg-surface shadow-lg",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 font-sans font-semibold text-[14px] leading-5 text-ink">
        <span className="tabular-nums">{summary}</span>
        <span className="font-medium text-ink-muted tabular-nums">{timeLabel}</span>
      </div>
      <Button
        variant="primary"
        size="lg"
        block
        disabled={!canStart}
        onClick={onStart}
        loading={starting}
        loadingText="Montando a sessão"
        iconLeft={<Play aria-hidden strokeWidth={1.75} className="size-5" />}
        className="disabled:opacity-45"
      >
        {startLabel}
      </Button>
      {error ? (
        <p role="alert" className="m-0 text-center font-sans font-semibold text-[13px] leading-[18px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
