"use client";

import { useId } from "react";
import { Shuffle } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import type { SessionLimit, SessionOrder } from "@/lib/api/study";
import { cn } from "@/lib/cn";

const LIMITS: ReadonlyArray<{ value: SessionLimit; label: string }> = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: null, label: "Todos" },
];

export type SessionOptionsProps = {
  limit: SessionLimit;
  onLimitChange: (limit: SessionLimit) => void;
  order: SessionOrder;
  onOrderChange: (order: SessionOrder) => void;
  className?: string;
};

/** "Quantos cards" e "Ordem". No desktop ficam no painel; no celular, abaixo da grade. */
export function SessionOptions({ limit, onLimitChange, order, onOrderChange, className }: SessionOptionsProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-wrap gap-4 md:gap-5", className)}>
      <div className="flex flex-col gap-2">
        <p id={`${id}-qtd`} className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
          Quantos cards
        </p>
        <div role="radiogroup" aria-labelledby={`${id}-qtd`} className="flex flex-wrap gap-2">
          {LIMITS.map((l) => (
            <Chip
              key={l.label}
              role="radio"
              selected={limit === l.value}
              onClick={() => onLimitChange(l.value)}
              className="tabular-nums"
            >
              {l.label}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex-[1_1_260px] flex flex-col gap-2">
        <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">Ordem</p>
        <SegmentedTabs<SessionOrder>
          as="radio"
          variant="block"
          ariaLabel="Ordem"
          value={order}
          onChange={onOrderChange}
          items={[
            { value: "DUE_FIRST", label: "Pendentes primeiro" },
            { value: "SHUFFLE", label: "Misturar", icon: <Shuffle aria-hidden strokeWidth={1.75} /> },
          ]}
        />
      </div>
    </div>
  );
}
