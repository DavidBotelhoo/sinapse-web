"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { RemovableChip } from "@/components/ui/Chip";
import { DeckGrid } from "@/components/decks/DeckGrid";
import { EmptyDecks } from "@/components/decks/EmptyDecks";
import { FiltersSheet } from "@/components/decks/FiltersSheet";
import { useCourseQuery } from "@/lib/api/courses";
import { useDecksQuery, useToggleFavorite, type Scope } from "@/lib/api/decks";
import { isApiError } from "@/lib/api/base";

const SCOPES: ReadonlyArray<Scope> = ["all", "mine", "community", "favorites"];

function isScope(v: string | null): v is Scope {
  return v !== null && (SCOPES as ReadonlyArray<string>).includes(v);
}

function uniq<T>(arr: ReadonlyArray<T>): ReadonlyArray<T> {
  return Array.from(new Set(arr));
}

export default function FlashcardsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const scope: Scope = isScope(params.get("scope")) ? (params.get("scope") as Scope) : "all";
  const qUrl = params.get("q") ?? "";
  const yearUrl = useMemo(
    () => uniq(params.getAll("year").map((v) => Number(v)).filter((v) => !Number.isNaN(v))),
    [params],
  );
  const subjectUrl = useMemo(() => uniq(params.getAll("subject")), [params]);

  const [qInput, setQInput] = useState(qUrl);
  const [debouncedQ, setDebouncedQ] = useState(qUrl);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(qInput), 300);
    return () => clearTimeout(t);
  }, [qInput]);

  // Keep URL in sync with debounced query (replace, not push).
  useEffect(() => {
    if (debouncedQ === qUrl) return;
    const sp = new URLSearchParams(params.toString());
    if (debouncedQ.trim()) sp.set("q", debouncedQ.trim());
    else sp.delete("q");
    router.replace(`/flashcards?${sp.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const course = useCourseQuery();
  const availableYears = course.data ? Array.from({ length: course.data.years }, (_, i) => i + 1) : [1, 2, 3, 4, 5, 6];
  const availableSubjects = course.data?.subjects ?? [];

  const decks = useDecksQuery({
    scope,
    year: yearUrl,
    subjectIds: subjectUrl,
    q: debouncedQ,
  });

  const toggleFav = useToggleFavorite();
  function onToggleFavorite(id: string, favorite: boolean) {
    setToggleError(null);
    toggleFav.mutate(
      { id, favorite },
      {
        onError: (err) => {
          setToggleError(isApiError(err) ? err.message : "Não foi possível salvar o favorito.");
        },
      },
    );
  }

  const changeUrl = useCallback(
    (patch: (sp: URLSearchParams) => void, mode: "push" | "replace" = "replace") => {
      const sp = new URLSearchParams(params.toString());
      patch(sp);
      const url = `/flashcards?${sp.toString()}`;
      if (mode === "push") router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [params, router],
  );

  function onScopeChange(next: Scope) {
    changeUrl((sp) => {
      if (next === "all") sp.delete("scope");
      else sp.set("scope", next);
    }, "push");
  }

  function setYears(next: ReadonlyArray<string>) {
    changeUrl((sp) => {
      sp.delete("year");
      for (const y of next) sp.append("year", y);
    });
  }
  function setSubjects(next: ReadonlyArray<string>) {
    changeUrl((sp) => {
      sp.delete("subject");
      for (const s of next) sp.append("subject", s);
    });
  }

  function removeYear(year: number) {
    setYears(yearUrl.filter((y) => y !== year).map((y) => String(y)));
  }
  function removeSubject(id: string) {
    setSubjects(subjectUrl.filter((s) => s !== id));
  }
  function clearFilters() {
    changeUrl((sp) => {
      sp.delete("year");
      sp.delete("subject");
    });
  }

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !decks.hasNextPage) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !decks.isFetchingNextPage) {
        decks.fetchNextPage();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [decks.hasNextPage, decks.isFetchingNextPage, decks]);

  const items = decks.data?.pages.flatMap((p) => p.items) ?? [];
  const counts = decks.data?.pages[0]?.counts;
  const total = counts?.[scope] ?? 0;

  const filters: FilterDef[] = [
    {
      id: "year",
      label: "Ano do curso",
      variant: "chips",
      singleValueLabel: (v) => `${v}º ano`,
      options: availableYears.map((y) => ({ value: String(y), label: `${y}º ano` })),
      selected: yearUrl.map((y) => String(y)),
      onChange: setYears,
    },
    {
      id: "subject",
      label: "Matéria",
      variant: "search",
      options: availableSubjects.map((s) => ({ value: s.id, label: s.name })),
      selected: subjectUrl,
      onChange: setSubjects,
    },
  ];

  const hasFilters = yearUrl.length > 0 || subjectUrl.length > 0 || debouncedQ.trim() !== "";
  const showNewCard = !hasFilters && (scope === "all" || scope === "mine");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-display font-bold text-title-1 text-ink">Flashcards</h1>
          <p className="m-0 font-sans text-body text-ink-muted">
            Seus decks e os que você salvou da Comunidade.
          </p>
        </div>
        <Link
          href="/flashcards/novo"
          className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md bg-primary text-on-primary font-sans font-semibold text-[15px] no-underline hover:bg-primary-hover [&_svg]:size-[18px]"
        >
          <Plus aria-hidden strokeWidth={1.75} />
          Criar deck
        </Link>
      </header>

      <div className="flex flex-col gap-4">
        <SegmentedTabs
          ariaLabel="Filtrar flashcards"
          value={scope}
          onChange={onScopeChange}
          items={[
            { value: "all", label: "Todos", count: counts?.all },
            { value: "mine", label: "Meus", count: counts?.mine },
            { value: "community", label: "Da comunidade", count: counts?.community },
            { value: "favorites", label: "Favoritos", count: counts?.favorites },
          ]}
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 h-control px-4 rounded-md border border-line-strong bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)] flex-1 min-w-[220px] max-w-[320px]">
            <Search aria-hidden strokeWidth={1.75} className="size-[18px] text-ink-faint" />
            <input
              type="search"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Buscar deck pelo nome"
              aria-label="Buscar deck pelo nome"
              className="flex-1 min-w-0 bg-transparent outline-0 border-0 font-sans text-[15px] leading-[22px] text-ink placeholder:text-ink-faint"
            />
          </label>
          <div className="hidden md:block flex-1 min-w-0">
            <FilterBar filters={filters} onClearAll={clearFilters} />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSheetOpen(true)}
            iconLeft={<SlidersHorizontal strokeWidth={1.75} className="size-[18px]" />}
            className="md:hidden"
          >
            Filtros
            {yearUrl.length + subjectUrl.length > 0 ? ` · ${yearUrl.length + subjectUrl.length}` : ""}
          </Button>
        </div>

        {(yearUrl.length > 0 || subjectUrl.length > 0) ? (
          <div className="md:hidden flex flex-wrap gap-2 items-center">
            {yearUrl.map((y) => (
              <RemovableChip key={`y-${y}`} onRemove={() => removeYear(y)} removeLabel={`Remover ${y}º ano`}>
                {y}º ano
              </RemovableChip>
            ))}
            {subjectUrl.map((id) => {
              const s = availableSubjects.find((v) => v.id === id);
              return (
                <RemovableChip key={`s-${id}`} onRemove={() => removeSubject(id)} removeLabel={`Remover ${s?.name ?? ""}`}>
                  {s?.name ?? "Matéria"}
                </RemovableChip>
              );
            })}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        ) : null}
      </div>

      {toggleError ? (
        <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
          {toggleError}
        </p>
      ) : null}

      {decks.isLoading ? (
        <p className="m-0 text-center font-sans text-ink-muted py-10">Carregando decks…</p>
      ) : items.length === 0 ? (
        <EmptyDecks scope={scope} hasFilters={hasFilters} onClearFilters={clearFilters} />
      ) : (
        <>
          <DeckGrid decks={items} onToggleFavorite={onToggleFavorite} showNewCard={showNewCard} />
          <div ref={sentinelRef} aria-hidden className="h-1" />
          <div className="flex flex-wrap items-center justify-between gap-3 font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
            <span>
              Mostrando {items.length} de {total} decks
            </span>
            {decks.hasNextPage ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => decks.fetchNextPage()}
                loading={decks.isFetchingNextPage}
                loadingText="Carregando…"
              >
                Carregar mais
              </Button>
            ) : null}
          </div>
        </>
      )}

      <FiltersSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        years={availableYears}
        subjects={availableSubjects}
        selectedYears={yearUrl}
        selectedSubjectIds={subjectUrl}
        onApply={({ years, subjectIds }) => {
          setYears(years.map((y) => String(y)));
          setSubjects(subjectIds);
        }}
      />
    </div>
  );
}
