"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { FileDrop, type FileDropState } from "@/components/ui/FileDrop";
import { ImportFileCard } from "./ImportFileCard";
import { ImportPreviewList } from "./ImportPreviewList";
import { useCreateImport, useImportQuery } from "@/lib/api/imports";
import { useAppendImport } from "@/lib/api/decks";
import { isApiError } from "@/lib/api/base";

export type ImportMoreDialogProps = {
  open: boolean;
  deckId: string;
  onClose: () => void;
};

export function ImportMoreDialog(props: ImportMoreDialogProps) {
  if (!props.open) return null;
  return <ImportMoreDialogBody {...props} />;
}

function ImportMoreDialogBody({ deckId, onClose }: ImportMoreDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importId, setImportId] = useState<string | null>(null);
  const [topError, setTopError] = useState<string | null>(null);

  const createImport = useCreateImport();
  const importQuery = useImportQuery(importId);
  const appendImport = useAppendImport();

  async function onPickFile(f: File) {
    setFile(f);
    setTopError(null);
    try {
      const created = await createImport.mutateAsync(f);
      setImportId(created.id);
    } catch (err) {
      setTopError(isApiError(err) ? err.message : "Não foi possível enviar o arquivo.");
      setFile(null);
    }
  }

  function removeFile() {
    setFile(null);
    setImportId(null);
    setTopError(null);
  }

  async function confirmImport() {
    if (!importId) return;
    setTopError(null);
    try {
      await appendImport.mutateAsync({ deckId, importId });
      onClose();
    } catch (err) {
      setTopError(isApiError(err) ? err.message : "Não foi possível importar os cards.");
    }
  }

  const importDetail = importQuery.data;
  const ready = importDetail?.status === "READY";
  const dropState: FileDropState = file ? { kind: "readOk", file, summary: "" } : { kind: "idle" };

  return (
    <Dialog
      open
      onClose={onClose}
      title="Importar mais cards"
      description="Envie outro PDF ou Word. Os cards novos vão para o fim do deck."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={appendImport.isPending}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={confirmImport}
            disabled={!ready || appendImport.isPending}
            loading={appendImport.isPending}
            loadingText="Importando…"
          >
            Importar {importDetail?.pairsFound ? `${importDetail.pairsFound - (importDetail.pairsMissingAnswer ?? 0)} cards` : "cards"}
          </Button>
        </>
      }
    >
      {topError ? (
        <p
          role="alert"
          className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]"
        >
          {topError}
        </p>
      ) : null}

      {!file ? (
        <FileDrop state={dropState} onFile={onPickFile} />
      ) : (
        <ImportFileCard file={file} importDetail={importDetail} onRemove={removeFile} />
      )}

      {ready && importDetail && importDetail.pairs.length > 0 ? (
        <div className="grid gap-2 max-h-[280px] overflow-y-auto border-t border-line pt-3">
          <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
            Prévia dos novos cards
          </p>
          <ImportPreviewList pairs={importDetail.pairs} limit={10} />
        </div>
      ) : null}
    </Dialog>
  );
}
