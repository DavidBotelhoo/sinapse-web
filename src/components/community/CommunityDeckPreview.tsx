"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Clock, Layers, Lock } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CardRow } from "@/components/decks/CardRow";
import { DeckHeaderLayout, deckIconButtonClass } from "@/components/decks/DeckHeaderLayout";
import { DeckMenu } from "@/components/decks/DeckMenu";
import { ReportDeckDialog } from "@/components/decks/ReportDeckDialog";
import { ReportedNotice } from "@/components/decks/ReportedNotice";
import { SearchField } from "@/components/decks/SearchField";
import { cardListClass, deckSectionClass } from "@/components/decks/deckSection";
import { formatRelative, savesLabel } from "@/components/decks/format";
import { isApiError } from "@/lib/api/base";
import { useToggleCommunitySave, type CommunityDeckDetail } from "@/lib/api/community";

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Prévia de um deck da Comunidade antes de salvar (tela 23). */
export function CommunityDeckPreview({ deck }: { deck: CommunityDeckDetail }) {
  const router = useRouter();
  const save = useToggleCommunitySave();
  const [q, setQ] = useState("");
  const [showAnswers, setShowAnswers] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);

  // Otimista: vira "Salvo" no clique e fica assim até a tela trocar para a versão salva.
  const saved = save.isPending || save.isSuccess;
  const owner = deck.owner.firstName;

  function onSave() {
    if (saved) return;
    save.mutate(
      { id: deck.id, saved: true },
      { onSuccess: () => router.replace(`/flashcards/${deck.id}?salvo=1`) },
    );
  }

  const cards = useMemo(() => {
    const needle = fold(q.trim());
    if (!needle) return deck.previewCards;
    return deck.previewCards.filter((c) => fold(`${c.question} ${c.answer}`).includes(needle));
  }, [deck.previewCards, q]);

  const saveError = save.isError
    ? isApiError(save.error) && save.error.status === 404
      ? "Este deck não está mais disponível."
      : "Não foi possível salvar o deck. Tente de novo."
    : null;

  return (
    <div className="flex flex-col gap-7 md:gap-8">
      <DeckHeaderLayout
        back={{ href: "/comunidade", label: "Comunidade" }}
        year={deck.year}
        subjects={deck.subjects}
        title={deck.name}
        meta={
          <>
            <span>
              <Layers aria-hidden strokeWidth={1.75} />
              {deck.cardCount} cards
            </span>
            <span>
              <Avatar name={owner} src={deck.owner.avatarUrl ?? undefined} size="xs" decorative />
              por <b>{owner}</b>
            </span>
            <span>
              <Bookmark aria-hidden strokeWidth={1.75} />
              {savesLabel(deck.saveCount + (saved ? 1 : 0))}
            </span>
            <span>
              <Clock aria-hidden strokeWidth={1.75} />
              Atualizado {formatRelative(deck.contentUpdatedAt)}
            </span>
          </>
        }
        primary={
          <Button
            variant="primary"
            onClick={onSave}
            aria-pressed={saved}
            iconLeft={
              saved ? (
                <BookmarkCheck aria-hidden strokeWidth={1.75} className="size-[18px]" />
              ) : (
                <Bookmark aria-hidden strokeWidth={1.75} className="size-[18px]" />
              )
            }
          >
            {saved ? "Salvo" : "Salvar deck"}
          </Button>
        }
        side={
          <DeckMenu isMine={false} onReport={() => setReportOpen(true)} triggerClassName={deckIconButtonClass} />
        }
      />

      {saveError ? (
        <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
          {saveError}
        </p>
      ) : null}
      {reported ? <ReportedNotice /> : null}

      <div className="flex flex-wrap items-center gap-4 p-5 rounded-lg border border-line bg-surface">
        <Avatar name={owner} src={deck.owner.avatarUrl ?? undefined} decorative />
        <p className="m-0 flex-[1_1_260px] text-ink-muted">
          <b className="font-semibold text-ink">Deck de {owner}</b>
          <br />
          Ao salvar, ele aparece em Flashcards e entra na sua agenda de revisão. O progresso é só seu.
        </p>
      </div>

      <section aria-labelledby="preview-cards" className={deckSectionClass}>
        <h2 id="preview-cards" className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
          Cards
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <SearchField value={q} onChange={setQ} placeholder="Buscar no deck" className="flex-1 min-w-[220px]" />
          <Chip selected={showAnswers} onClick={() => setShowAnswers((v) => !v)}>
            Mostrar respostas
          </Chip>
        </div>

        {cards.length > 0 ? (
          <ol className={cardListClass}>
            {cards.map((c) => (
              <li key={c.id}>
                <CardRow index={c.position} card={c} showAnswers={showAnswers} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="m-0 py-6 text-center text-ink-muted">Nenhum card da prévia com essa busca.</p>
        )}

        <div className="flex items-center gap-3 px-4 py-[14px] rounded-md bg-surface-2 text-ink">
          <Lock aria-hidden strokeWidth={1.75} className="size-5 shrink-0 text-ink-muted" />
          <p className="m-0 flex-1">
            Prévia com {deck.previewCards.length} de {deck.cardCount} cards. Salve o deck para ver e estudar todos.
          </p>
          <Button variant="primary" size="sm" onClick={onSave} disabled={saved}>
            {saved ? "Salvo" : "Salvar"}
          </Button>
        </div>
      </section>

      <ReportDeckDialog
        open={reportOpen}
        deckId={deck.id}
        onClose={() => setReportOpen(false)}
        onReported={() => setReported(true)}
      />
    </div>
  );
}
