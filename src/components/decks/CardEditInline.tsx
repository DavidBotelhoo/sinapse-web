"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type CardEditInlineProps = {
  initialQuestion: string;
  initialAnswer: string;
  saving?: boolean;
  onSave: (values: { question: string; answer: string }) => void;
  onCancel: () => void;
  onDelete: () => void;
};

const textareaClass =
  "block w-full min-h-16 px-3 py-[10px] rounded-md border border-line-strong bg-surface " +
  "font-sans text-[15px] leading-[22px] text-ink resize-y " +
  "focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-soft)] focus:outline-0";

/**
 * Edição na própria linha (dk-edit, tela 21): ocupa o lugar da linha do card. Abre com o foco em
 * "Pergunta"; Escape cancela.
 */
export function CardEditInline({
  initialQuestion,
  initialAnswer,
  saving,
  onSave,
  onCancel,
  onDelete,
}: CardEditInlineProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const dirty = question.trim() !== initialQuestion || answer.trim() !== initialAnswer;

  useEffect(() => {
    const el = questionRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  function submit() {
    if (!question.trim()) return;
    onSave({ question: question.trim(), answer: answer.trim() });
  }

  return (
    <div
      role="group"
      aria-label="Editar card"
      onKeyDown={(e) => {
        if (e.key === "Escape" && !saving) {
          e.preventDefault();
          e.stopPropagation();
          onCancel();
        }
      }}
      className="flex flex-col gap-3 p-4 bg-bg"
    >
      <div className="grid gap-[6px]">
        <label htmlFor={`${id}-q`} className="font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
          Pergunta
        </label>
        <textarea
          id={`${id}-q`}
          ref={questionRef}
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={textareaClass}
        />
      </div>
      <div className="grid gap-[6px]">
        <label htmlFor={`${id}-a`} className="font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
          Resposta
        </label>
        <textarea
          id={`${id}-a`}
          rows={3}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className={textareaClass}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          iconLeft={<Trash2 strokeWidth={1.75} className="size-[18px]" />}
          className="mr-auto"
        >
          Excluir card
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={submit}
          disabled={!dirty || !question.trim() || saving}
          loading={saving}
          loadingText="Salvando…"
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
