"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { DeckHeader } from "@/components/decks/DeckHeader";
import { DeckMenu } from "@/components/decks/DeckMenu";
import { DeckStats } from "@/components/decks/DeckStats";
import { CardList } from "@/components/decks/CardList";
import { DeckEditDialog } from "@/components/decks/DeckEditDialog";
import { ImportMoreDialog } from "@/components/decks/ImportMoreDialog";
import { ReportDeckDialog } from "@/components/decks/ReportDeckDialog";
import { ReportedNotice } from "@/components/decks/ReportedNotice";
import { deckIconButtonClass } from "@/components/decks/DeckHeaderLayout";
import { useStartDeckSession } from "@/components/decks/useStartDeckSession";
import {
  useDeckQuery,
  useDeleteDeck,
  useToggleFavorite,
  useToggleSaved,
  useUpdateDeck,
  type DeckDetail,
} from "@/lib/api/decks";
import { isApiError } from "@/lib/api/base";
import { SubscriptionNotice } from "@/components/billing/SubscriptionNotice";

export function DeckPage({ initialDeck, justSaved = false }: { initialDeck: DeckDetail; justSaved?: boolean }) {
  const router = useRouter();
  const deckQ = useDeckQuery(initialDeck.id);
  const deck = deckQ.data ?? initialDeck;

  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [removeSavedOpen, setRemoveSavedOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const study = useStartDeckSession(deck.id);

  const toggleFav = useToggleFavorite();
  const toggleSaved = useToggleSaved();
  const updateDeck = useUpdateDeck();
  const deleteDeck = useDeleteDeck();

  function onFav() {
    setTopError(null);
    toggleFav.mutate(
      { id: deck.id, favorite: !deck.isFavorite },
      {
        onError: (err) => setTopError(isApiError(err) ? err.message : "Não foi possível salvar."),
      },
    );
  }

  function confirmTogglePublish() {
    setTopError(null);
    updateDeck.mutate(
      { id: deck.id, visibility: deck.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC" },
      {
        onSuccess: () => setPublishOpen(false),
        onError: (err) => setTopError(isApiError(err) ? err.message : "Não foi possível atualizar."),
      },
    );
  }

  function confirmDelete() {
    setTopError(null);
    deleteDeck.mutate(deck.id, {
      onSuccess: () => router.push("/flashcards"),
      onError: (err) => setTopError(isApiError(err) ? err.message : "Não foi possível excluir."),
    });
  }

  function confirmRemoveSaved() {
    setTopError(null);
    toggleSaved.mutate(
      { id: deck.id, saved: false },
      {
        onSuccess: () => router.push("/flashcards?scope=community"),
        onError: (err) => setTopError(isApiError(err) ? err.message : "Não foi possível remover."),
      },
    );
  }

  async function saveEdit(values: { name: string; year: number; subjectIds: ReadonlyArray<string> }) {
    await updateDeck.mutateAsync({ id: deck.id, ...values });
  }

  const menu = (
    <DeckMenu
      isMine={deck.isMine}
      isPublic={deck.visibility === "PUBLIC"}
      onEdit={deck.isMine ? () => setEditOpen(true) : undefined}
      onTogglePublish={deck.isMine ? () => setPublishOpen(true) : undefined}
      onImportMore={deck.isMine ? () => setImportOpen(true) : undefined}
      onDelete={deck.isMine ? () => setDeleteOpen(true) : undefined}
      onRemoveSaved={!deck.isMine ? () => setRemoveSavedOpen(true) : undefined}
      onReport={!deck.isMine ? () => setReportOpen(true) : undefined}
      triggerClassName={deckIconButtonClass}
    />
  );

  return (
    <div className="flex flex-col gap-7 md:gap-8">
      <DeckHeader
        deck={deck}
        onToggleFavorite={onFav}
        onStudy={study.start}
        studying={study.starting}
        studyLabel={justSaved ? "Estudar agora" : "Estudar este deck"}
        menu={menu}
      />

      {reported ? <ReportedNotice /> : null}

      {study.needsSubscription ? <SubscriptionNotice what="estudar" /> : null}

      {study.error || topError ? (
        <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
          {study.error ?? topError}
        </p>
      ) : null}

      <DeckStats stats={deck.myStats} />

      <CardList
        deckId={deck.id}
        canEdit={deck.isMine}
        headerAction={
          deck.isMine ? (
            // No celular, "Importar mais cards" fica só no menu "…" (tela 19 celular).
            <div className="hidden md:block">
              <Button
                variant="secondary"
                size="sm"
                iconLeft={<FileUp strokeWidth={1.75} className="size-[18px]" />}
                onClick={() => setImportOpen(true)}
              >
                Importar mais cards
              </Button>
            </div>
          ) : null
        }
      />

      <DeckEditDialog
        open={editOpen}
        deck={deck}
        onClose={() => setEditOpen(false)}
        onSave={saveEdit}
      />

      <ImportMoreDialog
        open={importOpen}
        deckId={deck.id}
        onClose={() => setImportOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir este deck?"
        description="Essa ação não dá para desfazer. Os cards do deck e seu progresso são apagados."
        confirmLabel="Excluir deck"
        variant="danger"
        loading={deleteDeck.isPending}
      />

      <ConfirmDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onConfirm={confirmTogglePublish}
        title={deck.visibility === "PUBLIC" ? "Tornar este deck privado?" : "Publicar na Comunidade?"}
        description={
          deck.visibility === "PUBLIC"
            ? "O deck sai da Comunidade. Quem já tinha salvado continua com acesso, mas o deck para de aparecer na busca."
            : "Seu deck vai aparecer na Comunidade com seu primeiro nome. Outras pessoas vão poder salvar e estudar."
        }
        confirmLabel={deck.visibility === "PUBLIC" ? "Tornar privado" : "Publicar"}
        loading={updateDeck.isPending}
      />

      <ReportDeckDialog
        open={reportOpen}
        deckId={deck.id}
        onClose={() => setReportOpen(false)}
        onReported={() => setReported(true)}
      />

      <ConfirmDialog
        open={removeSavedOpen}
        onClose={() => setRemoveSavedOpen(false)}
        onConfirm={confirmRemoveSaved}
        title="Remover este deck dos seus flashcards?"
        description="Seu progresso de estudo com este deck será apagado."
        confirmLabel="Remover"
        variant="danger"
        loading={toggleSaved.isPending}
      />
    </div>
  );
}
