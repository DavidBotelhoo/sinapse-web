"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { DeckGrid } from "@/components/decks/DeckGrid";
import { DeckFilters } from "@/components/decks/DeckFilters";
import { EmptyDecks } from "@/components/decks/EmptyDecks";
import { useDeckFiltersUrl } from "@/components/decks/useDeckFiltersUrl";
import { useDecksQuery, useToggleFavorite, type Scope } from "@/lib/api/decks";
import { isApiError } from "@/lib/api/base";

const SCOPES: ReadonlyArray<Scope> = ["all", "mine", "community", "favorites"];

function isScope(v: string | null): v is Scope {
  return v !== null && (SCOPES as ReadonlyArray<string>).includes(v);
}

export default function FlashcardsPage() {
  const filtersState = useDeckFiltersUrl();
  const { params, changeUrl, q, years, subjectIds, clearFilters, hasFilters } = filtersState;

  const scope: Scope = isScope(params.get("scope")) ? (params.get("scope") as Scope) : "all";
  const [toggleError, setToggleError] = useState<string | null>(null);

  const decks = useDecksQuery({ scope, year: years, subjectIds, q });

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

  function onScopeChange(next: Scope) {
    changeUrl((sp) => {
      if (next === "all") sp.delete("scope");
      else sp.set("scope", next);
    }, "push");
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

  // Telas 10 e 11: o card "Criar novo deck" fecha a grade em Todos e Meus, com ou sem filtro.
  const showNewCard = scope === "all" || scope === "mine";

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

        <DeckFilters state={filtersState} searchPlaceholder="Buscar deck pelo nome" />
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
          {decks.hasNextPage ? (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => decks.fetchNextPage()}
                loading={decks.isFetchingNextPage}
                loadingText="Carregando…"
              >
                Carregar mais
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
