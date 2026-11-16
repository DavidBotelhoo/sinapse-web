"use client";

import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { CloudUpload, CheckCircle2, CircleAlert, X } from "lucide-react";
import { ProgressBar } from "./StatCard";
import { cn } from "@/lib/cn";

export type FileDropState =
  | { kind: "idle" }
  | { kind: "reading"; file: File; progress: number }
  | { kind: "readOk"; file: File; summary: string }
  | { kind: "readWarn"; file: File; summary: string };

export type FileDropProps = {
  accept?: string;
  maxMB?: number;
  state: FileDropState;
  onFile: (file: File) => void;
  onCancel?: () => void;
  helper?: ReactNode;
  className?: string;
};

export function FileDrop({
  accept = ".pdf,.docx",
  maxMB = 20,
  state,
  onFile,
  onCancel,
  helper,
  className,
}: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFile(file);
  }

  function onDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragover(true);
  }
  function onDragLeave() {
    setDragover(false);
  }
  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragover(false);
    handleFiles(e.dataTransfer.files);
  }

  if (state.kind === "idle") {
    return (
      <div className={cn("grid gap-2", className)}>
        <label
          data-dragover={dragover || undefined}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "grid justify-items-center gap-2 px-6 py-8 rounded-lg border-[1.5px] border-dashed border-line-strong bg-surface text-center cursor-pointer",
            "transition-[background-color,border-color] duration-(--dur-fast) ease-out",
            "hover:border-primary hover:bg-primary-soft",
            "data-[dragover=true]:border-primary data-[dragover=true]:bg-primary-soft",
            "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-focus has-[input:focus-visible]:outline-offset-2",
          )}
        >
          <span
            className={cn(
              "grid place-items-center size-[52px] mb-1 rounded-full bg-primary-soft text-on-primary-soft [&_svg]:size-6",
              "group-hover:bg-primary group-hover:text-on-primary",
            )}
            aria-hidden
          >
            <CloudUpload strokeWidth={1.75} />
          </span>
          <p className="m-0 font-sans font-semibold text-[15px] leading-[22px] text-ink">
            Arraste seu PDF ou Word aqui, ou{" "}
            <span className="text-primary underline underline-offset-4">escolha um arquivo</span>
          </p>
          <p className="m-0 font-sans font-medium text-[12px] leading-4 text-ink-muted">
            .pdf ou .docx · até {maxMB} MB · uma pergunta e uma resposta por bloco
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        {helper}
      </div>
    );
  }

  const badge = state.file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX";

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md border border-line bg-surface">
        <span
          aria-hidden
          className="grid place-items-center w-10 h-12 shrink-0 rounded-[8px] bg-surface-2 text-ink-muted font-sans font-extrabold text-[10px] leading-none tracking-wider"
        >
          {badge}
        </span>
        <div className="flex-1 min-w-0 grid gap-[6px]">
          <span className="font-sans font-semibold text-[14px] leading-5 text-ink overflow-hidden text-ellipsis whitespace-nowrap">
            {state.file.name}
          </span>
          {state.kind === "reading" ? (
            <>
              <ProgressBar value={state.progress} label="Lendo arquivo" />
              <Meta tone="muted">Lendo perguntas… {Math.round(state.progress)}%</Meta>
            </>
          ) : state.kind === "readOk" ? (
            <Meta tone="ok">
              <CheckCircle2 aria-hidden strokeWidth={1.75} />
              {state.summary}
            </Meta>
          ) : (
            <Meta tone="warn">
              <CircleAlert aria-hidden strokeWidth={1.75} />
              {state.summary}
            </Meta>
          )}
        </div>
        {onCancel ? (
          <button
            type="button"
            aria-label={state.kind === "reading" ? "Cancelar leitura" : "Remover arquivo"}
            onClick={onCancel}
            className="grid place-items-center size-control-sm rounded-full bg-transparent text-ink-muted cursor-pointer hover:bg-surface-2 hover:text-ink [&_svg]:size-5"
          >
            <X aria-hidden strokeWidth={1.75} />
          </button>
        ) : null}
      </div>
      {helper}
    </div>
  );
}

function Meta({ tone, children }: { tone: "muted" | "ok" | "warn"; children: ReactNode }) {
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
