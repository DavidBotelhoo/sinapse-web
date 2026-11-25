"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { FilterChipList, FilterOptionList, type FilterOption } from "@/components/ui/FilterBar";

export type FiltersSheetProps = {
  open: boolean;
  onClose: () => void;
  years: ReadonlyArray<number>;
  subjects: ReadonlyArray<{ id: string; name: string }>;
  selectedYears: ReadonlyArray<number>;
  selectedSubjectIds: ReadonlyArray<string>;
  onApply: (next: { years: ReadonlyArray<number>; subjectIds: ReadonlyArray<string> }) => void;
};

/**
 * Filtros do celular (tela 11): folha presa ao fundo, sobre o Dialog (foco preso, Escape fecha e
 * devolve o foco). As mudanças ficam num rascunho até "Ver decks".
 */
export function FiltersSheet(props: FiltersSheetProps) {
  if (!props.open) return null;
  return <FiltersSheetBody {...props} />;
}

function FiltersSheetBody({
  open,
  onClose,
  years,
  subjects,
  selectedYears,
  selectedSubjectIds,
  onApply,
}: FiltersSheetProps) {
  const [draftYears, setDraftYears] = useState<ReadonlyArray<string>>(selectedYears.map(String));
  const [draftSubjects, setDraftSubjects] = useState<ReadonlyArray<string>>(selectedSubjectIds);

  const yearOptions: ReadonlyArray<FilterOption> = years.map((y) => ({
    value: String(y),
    label: `${y}º ano`,
    shortLabel: `${y}º`,
  }));
  const subjectOptions: ReadonlyArray<FilterOption> = subjects.map((s) => ({ value: s.id, label: s.name }));

  const toggleIn = (set: (fn: (prev: ReadonlyArray<string>) => ReadonlyArray<string>) => void) => (v: string) =>
    set((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  function apply() {
    onApply({ years: draftYears.map(Number), subjectIds: draftSubjects });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Filtros"
      sheet
      headerAction={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDraftYears([]);
            setDraftSubjects([]);
          }}
        >
          Limpar
        </Button>
      }
      footer={
        <Button variant="primary" size="lg" block onClick={apply}>
          Ver decks
        </Button>
      }
    >
      <div className="flex flex-col gap-[10px]">
        <p aria-hidden className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
          Ano do curso
        </p>
        <FilterChipList label="Ano do curso" options={yearOptions} draft={draftYears} toggle={toggleIn(setDraftYears)} />
      </div>
      <div className="flex flex-col gap-[10px] min-h-0">
        <p aria-hidden className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
          Matéria
        </p>
        <FilterOptionList
          label="Matéria"
          options={subjectOptions}
          draft={draftSubjects}
          toggle={toggleIn(setDraftSubjects)}
          size="md"
        />
      </div>
    </Dialog>
  );
}
