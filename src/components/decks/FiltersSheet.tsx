"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip, Chips } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

export type FiltersSheetProps = {
  open: boolean;
  onClose: () => void;
  years: ReadonlyArray<number>;
  subjects: ReadonlyArray<{ id: string; name: string }>;
  selectedYears: ReadonlyArray<number>;
  selectedSubjectIds: ReadonlyArray<string>;
  onApply: (next: { years: ReadonlyArray<number>; subjectIds: ReadonlyArray<string> }) => void;
  resultCount?: number;
};

export function FiltersSheet(props: FiltersSheetProps) {
  if (!props.open || typeof document === "undefined") return null;
  return <FiltersSheetBody {...props} />;
}

function FiltersSheetBody({
  onClose,
  years,
  subjects,
  selectedYears,
  selectedSubjectIds,
  onApply,
  resultCount,
}: FiltersSheetProps) {
  const [draftYears, setDraftYears] = useState<ReadonlyArray<number>>(selectedYears);
  const [draftSubjects, setDraftSubjects] = useState<ReadonlyArray<string>>(selectedSubjectIds);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function toggleYear(y: number) {
    setDraftYears((prev) => (prev.includes(y) ? prev.filter((v) => v !== y) : [...prev, y]));
  }
  function toggleSubject(id: string) {
    setDraftSubjects((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }
  function clear() {
    setDraftYears([]);
    setDraftSubjects([]);
  }
  function apply() {
    onApply({ years: draftYears, subjectIds: draftSubjects });
    onClose();
  }

  const filtered = query
    ? subjects.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : subjects;

  return createPortal(
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-scrim"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        className={cn(
          "w-full max-h-[90dvh] overflow-y-auto",
          "rounded-t-xl bg-surface shadow-lg",
          "flex flex-col gap-4 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
            Filtros
          </h2>
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={onClose}
            className="grid place-items-center size-control-sm rounded-full bg-transparent text-ink-muted cursor-pointer hover:bg-surface-2 hover:text-ink [&_svg]:size-5"
          >
            <X aria-hidden strokeWidth={1.75} />
          </button>
        </div>

        <div className="grid gap-2">
          <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink">
            Ano do curso
          </p>
          <Chips group="checkbox" label="Ano do curso">
            {years.map((y) => (
              <Chip
                key={y}
                selected={draftYears.includes(y)}
                onClick={() => toggleYear(y)}
              >
                {y}º ano
              </Chip>
            ))}
          </Chips>
        </div>

        <div className="grid gap-2">
          <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink">
            Matéria
          </p>
          <label className="flex items-center gap-2 h-control-sm px-3 rounded-sm border border-line-strong bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar matéria"
              className="flex-1 min-w-0 bg-transparent outline-0 border-0 font-sans text-[14px] leading-5 text-ink placeholder:text-ink-faint"
            />
          </label>
          <Chips group="checkbox" label="Matérias">
            {filtered.length === 0 ? (
              <span className="font-sans text-[13px] text-ink-muted">
                Nenhuma matéria encontrada
              </span>
            ) : (
              filtered.map((s) => (
                <Chip
                  key={s.id}
                  selected={draftSubjects.includes(s.id)}
                  onClick={() => toggleSubject(s.id)}
                >
                  {s.name}
                </Chip>
              ))
            )}
          </Chips>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
          <Button variant="ghost" onClick={clear}>
            Limpar
          </Button>
          <Button variant="primary" onClick={apply}>
            {typeof resultCount === "number" ? `Ver ${resultCount} decks` : "Aplicar"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
