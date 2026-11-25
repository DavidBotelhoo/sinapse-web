"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { FilterBar, FilterTrigger, filterTriggerLabel } from "@/components/ui/FilterBar";
import { FiltersSheet } from "./FiltersSheet";
import { SearchField } from "@/components/ui/SearchField";
import type { DeckFiltersState } from "./useDeckFiltersUrl";

export type DeckFiltersProps = {
  state: DeckFiltersState;
  searchPlaceholder: string;
  /** Só no celular, entre a busca e os filtros (as abas Populares/Recentes da Comunidade). */
  mobileSlot?: ReactNode;
  /** Só no desktop, à direita da linha (desce para a linha de baixo quando os filtros crescem). */
  trailing?: ReactNode;
};

/**
 * Linha de busca e filtros (fx-) de Flashcards e Comunidade. No desktop, os filtros abrem
 * popover (FilterBar); no celular, os chips "Ano do curso" e "Matéria" abrem a folha.
 */
export function DeckFilters({ state, searchPlaceholder, mobileSlot, trailing }: DeckFiltersProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <SearchField
        value={state.qInput}
        onChange={state.setQInput}
        placeholder={searchPlaceholder}
        className="md:w-[300px] md:shrink-0"
      />
      {mobileSlot ? <div className="md:hidden">{mobileSlot}</div> : null}

      {/* Largura do conteúdo: quando os chips crescem, o que vem depois desce de linha (tela 18). */}
      <div className="hidden md:block min-w-0">
        <FilterBar filters={state.filters} onClearAll={state.clearFilters} />
      </div>

      <div className="md:hidden flex items-center gap-2 -mx-4 px-4 overflow-x-auto [scrollbar-width:none]">
        {state.filters.map((f) => (
          <FilterTrigger
            key={f.id}
            label={filterTriggerLabel(f)}
            active={f.selected.length > 0}
            expanded={sheetOpen}
            aria-haspopup="dialog"
            onClick={() => setSheetOpen(true)}
          />
        ))}
        {state.filterCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={state.clearFilters} className="shrink-0">
            Limpar filtros
          </Button>
        ) : null}
      </div>

      {trailing ? <div className="hidden md:block md:ml-auto">{trailing}</div> : null}

      <FiltersSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        years={state.availableYears}
        subjects={state.availableSubjects}
        selectedYears={state.years}
        selectedSubjectIds={state.subjectIds}
        onApply={({ years, subjectIds }) => {
          state.changeUrl((sp) => {
            sp.delete("year");
            sp.delete("subject");
            for (const y of years) sp.append("year", String(y));
            for (const s of subjectIds) sp.append("subject", s);
          });
        }}
      />
    </div>
  );
}
