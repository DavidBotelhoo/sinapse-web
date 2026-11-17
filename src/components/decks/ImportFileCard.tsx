"use client";

import { X, CheckCircle2, CircleAlert } from "lucide-react";
import { ProgressBar } from "@/components/ui/StatCard";
import type { ImportDetail } from "@/lib/api/imports";
import { cn } from "@/lib/cn";

export type ImportFileCardProps = {
  file: File;
  importDetail?: ImportDetail;
  onRemove: () => void;
};

export function ImportFileCard({ file, importDetail, onRemove }: ImportFileCardProps) {
  const badge = file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX";
  const status = importDetail?.status ?? "PENDING";
  const reading = status === "PENDING" || status === "PROCESSING";
  const failed = status === "FAILED";

  return (
    <div className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md border border-line bg-surface">
      <span
        aria-hidden
        className="grid place-items-center w-10 h-12 shrink-0 rounded-[8px] bg-surface-2 text-ink-muted font-sans font-extrabold text-[10px] leading-none tracking-wider"
      >
        {badge}
      </span>
      <div className="flex-1 min-w-0 grid gap-[6px]">
        <span className="font-sans font-semibold text-[14px] leading-5 text-ink overflow-hidden text-ellipsis whitespace-nowrap">
          {file.name}
        </span>
        {reading ? (
          <>
            <ProgressBar value={importDetail?.progress ?? 0} label="Lendo arquivo" />
            <Meta tone="muted">
              Lendo perguntas… {Math.round(importDetail?.progress ?? 0)}%
            </Meta>
          </>
        ) : status === "READY" ? (
          (importDetail?.pairsMissingAnswer ?? 0) > 0 ? (
            <Meta tone="warn">
              <CircleAlert aria-hidden strokeWidth={1.75} />
              {importDetail!.pairsFound! - importDetail!.pairsMissingAnswer!} prontas ·{" "}
              {importDetail!.pairsMissingAnswer} perguntas sem resposta
            </Meta>
          ) : (
            <Meta tone="ok">
              <CheckCircle2 aria-hidden strokeWidth={1.75} />
              {importDetail!.pairsFound} perguntas com resposta encontradas
            </Meta>
          )
        ) : failed ? (
          <Meta tone="warn">
            <CircleAlert aria-hidden strokeWidth={1.75} />
            {importDetail?.error ?? "Não foi possível ler o arquivo."}
          </Meta>
        ) : (
          <Meta tone="muted">Pronto para começar.</Meta>
        )}
      </div>
      <button
        type="button"
        aria-label={reading ? "Cancelar leitura" : "Remover arquivo"}
        onClick={onRemove}
        className="grid place-items-center size-control-sm rounded-full bg-transparent text-ink-muted cursor-pointer hover:bg-surface-2 hover:text-ink [&_svg]:size-5"
      >
        <X aria-hidden strokeWidth={1.75} />
      </button>
    </div>
  );
}

function Meta({ tone, children }: { tone: "muted" | "ok" | "warn"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "flex items-center gap-[6px] font-sans font-medium text-[12px] leading-4 [&_svg]:size-[14px]",
        tone === "ok" ? "text-success" : tone === "warn" ? "text-warning" : "text-ink-muted",
      )}
    >
      {children}
    </span>
  );
}
