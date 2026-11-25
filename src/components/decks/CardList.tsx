"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { CardRow } from "./CardRow";
import { SearchField } from "@/components/ui/SearchField";
import { cardListClass, deckSectionClass } from "./deckSection";
import { CardEditInline } from "./CardEditInline";
import {
  useCardsQuery,
  useDeleteCard,
  useUpdateCard,
  type CardListFilterStatus,
  type CardListCounts,
  type CardItem,
} from "@/lib/api/cards";
import { isApiError } from "@/lib/api/base";
import { cn } from "@/lib/cn";

export type CardListProps = {
  deckId: string;
  canEdit: boolean;
  counts?: CardListCounts;
  /** À direita do título "Cards" ("Importar mais cards", tela 19). */
  headerAction?: React.ReactNode;
};

const TABS: ReadonlyArray<{ value: CardListFilterStatus; label: string; countKey: keyof CardListCounts }> = [
  { value: "all", label: "Todos", countKey: "all" },
  { value: "due", label: "Para hoje", countKey: "due" },
  { value: "new", label: "Novos", countKey: "new" },
  { value: "mastered", label: "Dominados", countKey: "mastered" },
];

const editButtonId = (cardId: string) => `card-edit-${cardId}`;

export function CardList({ deckId, canEdit, counts, headerAction }: CardListProps) {
  const [tab, setTab] = useState<CardListFilterStatus>("all");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [showAnswers, setShowAnswers] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [topError, setTopError] = useState<string | null>(null);
  // Quando a edição fecha, o foco volta para o lápis do mesmo card.
  const returnFocusRef = useRef<string | null>(null);

  useEffect(() => {
    if (editingId !== null || !returnFocusRef.current) return;
    document.getElementById(editButtonId(returnFocusRef.current))?.focus();
    returnFocusRef.current = null;
  }, [editingId]);

  function closeEditor() {
    returnFocusRef.current = editingId;
    setEditingId(null);
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const query = useCardsQuery({ deckId, status: tab, q: debouncedQ });
  const update = useUpdateCard();
  const del = useDeleteCard();

  const allCards = useMemo<ReadonlyArray<CardItem>>(
    () => query.data?.pages.flatMap((p) => p.items) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.counts[tab === "all" ? "all" : tab] ?? 0;
  const latestCounts = query.data?.pages[query.data.pages.length - 1]?.counts ?? counts;

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !query.hasNextPage) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query]);

  const cardToDelete = allCards.find((c) => c.id === deletingId) ?? null;

  function saveEdit(id: string, values: { question: string; answer: string }) {
    setTopError(null);
    update.mutate(
      { deckId, id, question: values.question, answer: values.answer },
      {
        onSuccess: closeEditor,
        onError: (err) => {
          setTopError(isApiError(err) ? err.message : "Não foi possível salvar.");
        },
      },
    );
  }

  function confirmDelete() {
    if (!deletingId) return;
    del.mutate(
      { deckId, id: deletingId },
      {
        onSuccess: () => {
          setDeletingId(null);
          setEditingId(null);
        },
        onError: (err) => {
          setTopError(isApiError(err) ? err.message : "Não foi possível excluir.");
        },
      },
    );
  }

  return (
    <section aria-labelledby="deck-cards" className={deckSectionClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="deck-cards" className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
          Cards
        </h2>
        {headerAction}
      </div>

      <SegmentedTabs
        ariaLabel="Filtrar cards"
        value={tab}
        onChange={(v) => {
          setTab(v);
          setEditingId(null);
        }}
        items={TABS.map((t) => ({
          value: t.value,
          label: t.label,
          count: latestCounts?.[t.countKey] ?? 0,
        }))}
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchField value={q} onChange={setQ} placeholder="Buscar no deck" className="flex-1 min-w-[220px]" />
        <Chip selected={showAnswers} onClick={() => setShowAnswers((v) => !v)}>
          Mostrar respostas
        </Chip>
      </div>

      {topError ? (
        <p
          role="alert"
          className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]"
        >
          {topError}
        </p>
      ) : null}

      {query.isLoading ? (
        <p className="m-0 text-center font-sans text-ink-muted py-8">Carregando cards…</p>
      ) : allCards.length === 0 ? (
        <p className="m-0 text-center font-sans text-ink-muted py-8">
          {debouncedQ ? "Nenhum card com essa busca." : "Nenhum card nessa aba."}
        </p>
      ) : (
        <ol className={cardListClass}>
          {allCards.map((card, i) => (
            <li key={card.id}>
              {/* Tela 21: o editor ocupa o lugar da linha. */}
              {editingId === card.id && canEdit ? (
                <CardEditInline
                  initialQuestion={card.question}
                  initialAnswer={card.answer}
                  saving={update.isPending && update.variables?.id === card.id}
                  onSave={(values) => saveEdit(card.id, values)}
                  onCancel={closeEditor}
                  onDelete={() => setDeletingId(card.id)}
                />
              ) : (
                <CardRow
                  index={i + 1}
                  card={card}
                  showAnswers={showAnswers}
                  canEdit={canEdit}
                  onEdit={() => setEditingId(card.id)}
                  editButtonId={editButtonId(card.id)}
                />
              )}
            </li>
          ))}
        </ol>
      )}

      <div ref={sentinelRef} aria-hidden className="h-1" />

      {allCards.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
          <span>
            Mostrando {allCards.length} de {total} cards
          </span>
          {query.hasNextPage ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => query.fetchNextPage()}
              loading={query.isFetchingNextPage}
              loadingText="Carregando…"
            >
              Carregar mais
            </Button>
          ) : null}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Excluir este card?"
        description={
          cardToDelete ? `"${cardToDelete.question}" vai ser removido do deck. Essa ação não dá para desfazer.` : undefined
        }
        confirmLabel="Excluir card"
        variant="danger"
        loading={del.isPending}
      />
    </section>
  );
}
