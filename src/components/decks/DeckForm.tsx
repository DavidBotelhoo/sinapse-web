"use client";

import { useMemo, useState } from "react";
import { Globe, Lock, Search } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Chip, Chips } from "@/components/ui/Chip";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import type { Visibility } from "@/lib/api/decks";
import type { Subject } from "@/lib/api/courses";

export type DeckFormValues = {
  name: string;
  year: number | null;
  subjectIds: ReadonlyArray<string>;
  visibility: Visibility;
};

export type DeckFormProps = {
  years: ReadonlyArray<number>;
  subjects: ReadonlyArray<Subject>;
  value: DeckFormValues;
  onChange: (next: DeckFormValues) => void;
  showVisibility?: boolean;
  nameError?: string;
  /** Dica do nome. Na criação, muda quando o nome veio do arquivo (telas 13 e 14). */
  nameHint?: string;
};

export function DeckForm({
  years,
  subjects,
  value,
  onChange,
  showVisibility = true,
  nameError,
  nameHint = "Aparece na sua lista e, se for público, na Comunidade.",
}: DeckFormProps) {
  const [query, setQuery] = useState("");

  const selected = useMemo(() => new Set(value.subjectIds), [value.subjectIds]);
  const filtered = useMemo(() => {
    if (!query.trim()) return subjects;
    const q = query.trim().toLowerCase();
    return subjects.filter((s) => s.name.toLowerCase().includes(q));
  }, [subjects, query]);

  function patch(next: Partial<DeckFormValues>) {
    onChange({ ...value, ...next });
  }

  function toggleSubject(id: string) {
    const current = new Set(value.subjectIds);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    patch({ subjectIds: [...current] });
  }

  return (
    <div className="grid gap-5">
      <TextField
        label="Nome do deck"
        placeholder="Ex.: Farmacologia do SNA, P1"
        value={value.name}
        onChange={(e) => patch({ name: e.target.value })}
        hint={nameHint}
        error={nameError}
        maxLength={120}
      />

      <div className="grid gap-2">
        <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink">Ano do curso</p>
        <Chips group="radio" label="Ano do curso">
          {years.map((y) => (
            <Chip
              key={y}
              role="radio"
              selected={value.year === y}
              onClick={() => patch({ year: y })}
            >
              {y}º ano
            </Chip>
          ))}
        </Chips>
      </div>

      <div className="grid gap-2">
        <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink">
          Matérias <span className="font-medium text-ink-muted">· escolha uma ou mais</span>
        </p>
        <label className="flex items-center gap-2 h-control-sm px-3 rounded-sm border border-line-strong bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)]">
          <Search aria-hidden strokeWidth={1.75} className="size-4 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar outra matéria"
            aria-label="Buscar matéria"
            className="flex-1 min-w-0 bg-transparent outline-0 border-0 font-sans text-[14px] leading-5 text-ink placeholder:text-ink-faint"
          />
        </label>
        <Chips group="checkbox" label="Matérias">
          {filtered.length === 0 ? (
            <span className="font-sans text-[13px] text-ink-muted">Nenhuma matéria encontrada</span>
          ) : (
            filtered.map((s) => (
              <Chip key={s.id} selected={selected.has(s.id)} onClick={() => toggleSubject(s.id)}>
                {s.name}
              </Chip>
            ))
          )}
        </Chips>
      </div>

      {showVisibility ? (
        <div className="grid gap-2">
          <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink">Visibilidade</p>
          <SegmentedTabs
            as="radio"
            variant="block"
            ariaLabel="Visibilidade"
            value={value.visibility}
            onChange={(v) => patch({ visibility: v })}
            items={[
              {
                value: "PRIVATE",
                label: (
                  <span className="inline-flex items-center gap-2">
                    <Lock aria-hidden strokeWidth={1.75} /> Privado
                  </span>
                ),
              },
              {
                value: "PUBLIC",
                label: (
                  <span className="inline-flex items-center gap-2">
                    <Globe aria-hidden strokeWidth={1.75} /> Público
                  </span>
                ),
              },
            ]}
          />
          <p className="m-0 font-sans font-medium text-[12px] leading-4 text-ink-muted">
            {value.visibility === "PRIVATE"
              ? "Só você vê este deck. Dá para publicar depois."
              : "Decks públicos aparecem na Comunidade com seu primeiro nome."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
