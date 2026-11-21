"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Flame, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { CommunityDeckCard } from "@/components/community/CommunityDeckCard";
import { DeckFilters } from "@/components/decks/DeckFilters";
import { useDeckFiltersUrl } from "@/components/decks/useDeckFiltersUrl";
import {
  useCommunityDecks,
  useToggleCommunitySave,
  type CommunityDeck,
  type CommunitySort,
} from "@/lib/api/community";
import { isApiError } from "@/lib/api/base";

function plural(n: number, one: string, many: string) {
  return `${n.toLocaleString("pt-BR")} ${n === 1 ? one : many}`;
}

export default function ComunidadePage() {
  const filtersState = useDeckFiltersUrl();
  const { params, changeUrl, q, years, subjectIds, clearFilters, hasFilters, setQInput } = filtersState;
  const sort: CommunitySort = params.get("sort") === "recent" ? "recent" : "popular";

  const decks = useCommunityDecks({ sort, year: years, subjectIds, q });
  const toggle = useToggleCommunitySave();
  const [unsaving, setUnsaving] = useState<CommunityDeck | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  function onSortChange(next: CommunitySort) {
    changeUrl((sp) => {
      if (next === "popular") sp.delete("sort");
      else sp.set("sort", next);
    }, "push");
  }

  function setSaved(deck: CommunityDeck, saved: boolean) {
    setSaveError(null);
    toggle.mutate(
      { id: deck.id, saved },
      {
        onError: (err) =>
          setSaveError(
            isApiError(err) && err.status === 404
              ? `"${deck.name}" não está mais disponível.`
              : saved
                ? "Não foi possível salvar o deck. Tente de novo."
                : "Não foi possível remover o deck. Tente de novo.",
          ),
      },
    );
  }

  // Salvar é na hora; tirar apaga o progresso, então pede confirmação antes.
  function onToggleSave(deck: CommunityDeck) {
    if (deck.isSaved) setUnsaving(deck);
    else setSaved(deck, true);
  }

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !decks.hasNextPage) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !decks.isFetchingNextPage) decks.fetchNextPage();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [decks.hasNextPage, decks.isFetchingNextPage, decks]);

  const items = decks.data?.pages.flatMap((p) => p.items) ?? [];
  const total = decks.data?.pages[0]?.total ?? 0;
  const summary = hasFilters
    ? plural(total, "deck encontrado", "decks encontrados")
    : `${plural(total, "deck público", "decks públicos")} · mostrando os ${sort === "popular" ? "mais salvos" : "mais recentes"}`;

  const sortTabs = (variant: "line" | "block") => (
    <SegmentedTabs<CommunitySort>
      ariaLabel="Ordenar decks"
      variant={variant}
      value={sort}
      onChange={onSortChange}
      items={[
        { value: "popular", label: "Populares", icon: <Flame aria-hidden strokeWidth={1.75} /> },
        { value: "recent", label: "Recentes", icon: <Clock aria-hidden strokeWidth={1.75} /> },
      ]}
    />
  );

  return (
    <div className="flex flex-col gap-7 md:gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="m-0 font-display text-title-1 text-ink">Comunidade</h1>
        <p className="m-0 text-ink-muted">
          Decks públicos de outros estudantes.
          <span className="max-md:hidden"> Salve um e ele aparece em Flashcards, pronto para estudar.</span>
        </p>
      </header>

      <div className="flex flex-col gap-4 md:gap-5">
        <DeckFilters
          state={filtersState}
          searchPlaceholder="Buscar por nome ou assunto"
          mobileSlot={sortTabs("block")}
          trailing={sortTabs("line")}
        />
        {decks.data ? (
          <p className="m-0 font-sans font-medium text-[13px] leading-[18px] text-ink-muted tabular-nums max-md:sr-only" aria-live="polite">
            {summary}
          </p>
        ) : null}
      </div>

      {saveError ? (
        <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
          {saveError}
        </p>
      ) : null}

      {decks.isLoading ? (
        <p className="m-0 text-center font-sans text-ink-muted py-10">Carregando decks…</p>
      ) : decks.isError ? (
        <p role="alert" className="m-0 text-center font-sans text-ink-muted py-10">
          Não foi possível carregar a Comunidade.{" "}
          <Button variant="ghost" size="sm" onClick={() => decks.refetch()}>
            Tentar de novo
          </Button>
        </p>
      ) : items.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={<Search strokeWidth={1.75} />}
            title="Nenhum deck com esses filtros"
            body="Tente outra busca ou tire um dos filtros."
            primaryAction={
              <Button
                variant="primary"
                onClick={() => {
                  setQInput("");
                  clearFilters();
                }}
              >
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="Ainda não há decks públicos do seu curso"
            body="Quando alguém publicar um deck, ele aparece aqui. Você também pode publicar os seus."
            primaryAction={
              <ButtonLink href="/flashcards/novo" iconLeft={<Plus aria-hidden strokeWidth={1.75} />}>
                Criar deck
              </ButtonLink>
            }
          />
        )
      ) : (
        <>
          <section
            aria-label="Decks da comunidade"
            className="-mt-4 md:-mt-3 grid gap-x-4 gap-y-4 md:gap-y-6 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]"
          >
            {items.map((deck) => (
              <CommunityDeckCard key={deck.id} deck={deck} onToggleSave={onToggleSave} />
            ))}
          </section>
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

      <ConfirmDialog
        open={unsaving !== null}
        onClose={() => setUnsaving(null)}
        onConfirm={() => {
          if (unsaving) setSaved(unsaving, false);
          setUnsaving(null);
        }}
        title="Remover este deck dos seus flashcards?"
        description="Seu progresso de estudo com este deck será apagado."
        confirmLabel="Remover"
        variant="danger"
      />
    </div>
  );
}
