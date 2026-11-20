"use client";

import type { ReactNode } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RemovableChip } from "@/components/ui/Chip";
import { Tag } from "@/components/ui/Tag";
import { num } from "./format";
import { cn } from "@/lib/cn";

export type SessionPanelProps = {
  /** "2 temas", "1 deck"; some sem seleção. */
  selectionLabel: string | null;
  selected: ReadonlyArray<{ id: string; name: string }>;
  onRemove: (id: string) => void;
  cards: number;
  pending: number;
  timeLabel: string;
  startLabel: string;
  canStart: boolean;
  starting?: boolean;
  onStart: () => void;
  error?: string | null;
  options: ReactNode;
  className?: string;
};

/** "Sua sessão": painel ao lado da grade no desktop (st-card). */
export function SessionPanel({
  selectionLabel,
  selected,
  onRemove,
  cards,
  pending,
  timeLabel,
  startLabel,
  canStart,
  starting,
  onStart,
  error,
  options,
  className,
}: SessionPanelProps) {
  return (
    <aside
      aria-labelledby="st-sessao"
      className={cn(
        "flex flex-col gap-5 p-6 rounded-xl border border-line bg-surface shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="st-sessao" className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
          Sua sessão
        </h2>
        {selectionLabel ? <Tag tone="brand">{selectionLabel}</Tag> : null}
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Selecionados">
          {selected.map((s) => (
            <RemovableChip key={s.id} onRemove={() => onRemove(s.id)} removeLabel={`Remover ${s.name}`}>
              <span className="max-w-[220px] overflow-hidden text-ellipsis">{s.name}</span>
            </RemovableChip>
          ))}
        </div>
      ) : (
        <p className="m-0 text-ink-muted">Nada selecionado ainda. Toque nos temas ou decks que quer revisar.</p>
      )}

      <dl className="grid grid-cols-3 gap-2 m-0">
        <Fact term="Cards" value={num(cards)} />
        <Fact term="Pendentes" value={num(pending)} />
        <Fact term="Tempo" value={timeLabel} />
      </dl>

      <div className="grid gap-2">
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

      <hr className="m-0 border-0 border-t border-line" />

      {options}
    </aside>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div className="py-[10px] px-3 rounded-md bg-surface-2">
      <dt className="font-sans font-medium text-[12px] leading-4 text-ink-muted">{term}</dt>
      <dd className="m-0 mt-[2px] font-sans font-bold text-[17px] leading-6 tabular-nums text-ink">{value}</dd>
    </div>
  );
}
