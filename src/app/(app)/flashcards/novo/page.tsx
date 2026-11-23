"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FileDrop, type FileDropState } from "@/components/ui/FileDrop";
import { Tag } from "@/components/ui/Tag";
import { ImportFileCard } from "@/components/decks/ImportFileCard";
import { ImportPreviewList } from "@/components/decks/ImportPreviewList";
import { DeckForm, type DeckFormValues } from "@/components/decks/DeckForm";
import { MissingLine, type MissingStep } from "@/components/decks/CreateDeckSteps";
import { useCourseQuery } from "@/lib/api/courses";
import { useCreateImport, useImportQuery } from "@/lib/api/imports";
import { useCreateDeck } from "@/lib/api/decks";
import { isApiError } from "@/lib/api/base";
import { SubscriptionNotice } from "@/components/billing/SubscriptionNotice";
import { useAccessGate } from "@/components/billing/useAccessGate";

export default function CriarDeckPage() {
  const router = useRouter();
  const course = useCourseQuery();
  const createImport = useCreateImport();
  const createDeck = useCreateDeck();
  // Sem assinatura ativa, a página mostra só o aviso no lugar da área de importar.
  const gate = useAccessGate();

  const [file, setFile] = useState<File | null>(null);
  const [importId, setImportId] = useState<string | null>(null);
  const importQuery = useImportQuery(importId);
  const importDetail = importQuery.data;

  const [values, setValues] = useState<DeckFormValues>({
    name: "",
    year: null,
    subjectIds: [],
    visibility: "PRIVATE",
  });
  const [nameTouched, setNameTouched] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const suggestedName = importDetail?.status === "READY" ? importDetail.suggestedName : "";
  const effectiveName = nameTouched ? values.name : (values.name || suggestedName);

  async function onPickFile(f: File) {
    setFile(f);
    setTopError(null);
    try {
      const created = await createImport.mutateAsync(f);
      setImportId(created.id);
    } catch (err) {
      setFile(null);
      if (gate.handle(err)) return;
      setTopError(isApiError(err) ? err.message : "Não foi possível enviar o arquivo.");
    }
  }

  function removeFile() {
    setFile(null);
    setImportId(null);
    setValues((v) => ({ ...v, name: "" }));
    setNameTouched(false);
  }

  const years = course.data ? Array.from({ length: course.data.years }, (_, i) => i + 1) : [];
  const subjects = course.data?.subjects ?? [];

  const missing = useMemo<MissingStep | null>(() => {
    if (!importId) return "import";
    if (!importDetail || importDetail.status === "PENDING" || importDetail.status === "PROCESSING") return "import-reading";
    if (!effectiveName.trim()) return "name";
    if (values.year === null) return "year";
    if (values.subjectIds.length === 0) return "subjects";
    return null;
  }, [importId, importDetail, effectiveName, values.year, values.subjectIds]);

  const canSubmit = missing === null && importDetail?.status === "READY";

  async function submit() {
    if (!canSubmit || !importId) return;
    setTopError(null);
    try {
      const deck = await createDeck.mutateAsync({
        importId,
        name: effectiveName.trim(),
        year: values.year!,
        subjectIds: values.subjectIds,
        visibility: values.visibility,
      });
      router.push(`/flashcards/${deck.id}`);
    } catch (err) {
      if (gate.handle(err)) return;
      setTopError(isApiError(err) ? err.message : "Não foi possível criar o deck.");
    }
  }

  const ready = importDetail?.status === "READY";
  const dropState: FileDropState = { kind: "idle" };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1 h-control-sm px-3 -ml-3 self-start rounded-md text-ink-muted font-sans font-semibold text-[14px] leading-none no-underline hover:bg-surface-2 hover:text-ink [&_svg]:size-[18px]"
        >
          <ArrowLeft aria-hidden strokeWidth={1.75} />
          Flashcards
        </Link>
        <h1 className="m-0 font-display font-bold text-title-1 text-ink">Criar deck</h1>
        <p className="m-0 font-sans text-body text-ink-muted">
          Importe um arquivo com perguntas e respostas e diga de que matéria ele é.
        </p>
      </header>

      {topError ? (
        <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
          {topError}
        </p>
      ) : null}

      {gate.blocked ? (
        <SubscriptionNotice what="importar arquivos e criar decks" />
      ) : (
        <div className="grid gap-6 md:grid-cols-[3fr_2fr] md:items-start">
          <div className="min-w-0 flex flex-col gap-6">
            <Section step="1" title="Arquivo">
              {!file ? (
                <FileDrop state={dropState} onFile={onPickFile} />
              ) : (
                <ImportFileCard file={file} importDetail={importDetail} onRemove={removeFile} />
              )}
            </Section>

            {ready && importDetail && importDetail.pairs.length > 0 ? (
              <Section
                title="Prévia dos cards"
                right={
                  <Tag tone="brand">
                    {importDetail.pairsFound} cards{importDetail.pairsMissingAnswer ? ` · ${importDetail.pairsMissingAnswer} sem resposta` : ""}
                  </Tag>
                }
              >
                <ImportPreviewList pairs={importDetail.pairs} limit={8} />
                <p className="m-0 font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
                  {importDetail.pairs.length > 8
                    ? `Mostrando os 8 primeiros de ${importDetail.pairsFound}. Os demais aparecem na tela do deck para você revisar e editar.`
                    : "Você pode revisar e editar os cards na tela do deck depois de criar."}
                </p>
              </Section>
            ) : null}
          </div>

          <aside className="min-w-0 md:sticky md:top-6">
            <Section step="2" title="Detalhes">
              <DeckForm
                years={years}
                subjects={subjects}
                value={{ ...values, name: effectiveName }}
                onChange={(next) => {
                  if (next.name !== effectiveName) setNameTouched(true);
                  setValues(next);
                }}
              />
              <hr className="border-0 border-t border-line" />
              <div className="flex flex-col gap-[10px]">
                <Button
                  variant="primary"
                  size="lg"
                  block
                  onClick={submit}
                  disabled={!canSubmit || createDeck.isPending}
                  loading={createDeck.isPending}
                  loadingText="Criando deck…"
                >
                  Criar deck
                </Button>
                <MissingLine step={missing} />
              </div>
            </Section>
          </aside>
        </div>
      )}
    </div>
  );
}

function Section({
  step,
  title,
  right,
  children,
}: {
  step?: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 p-5 md:p-6 rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {step ? (
            <span
              aria-hidden
              className="grid place-items-center size-7 rounded-full bg-primary text-on-primary font-display font-bold text-[14px] leading-none"
            >
              {step}
            </span>
          ) : null}
          <h2 className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
