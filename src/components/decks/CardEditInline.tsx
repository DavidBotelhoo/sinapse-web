"use client";

import { useState } from "react";
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
  const dirty =
    question.trim() !== initialQuestion || answer.trim() !== initialAnswer;

  function submit() {
    if (!question.trim()) return;
    onSave({ question: question.trim(), answer: answer.trim() });
  }

  return (
    <div className="grid gap-3 mt-3 p-4 rounded-md border border-line bg-surface-2">
      <label className="grid gap-[6px]">
        <span className="font-sans font-semibold text-[13px] leading-[18px] text-ink">Pergunta</span>
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full min-h-[60px] p-3 rounded-md border border-line-strong bg-surface font-sans text-[15px] leading-[22px] text-ink resize-y focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-soft)] focus:outline-0"
        />
      </label>
      <label className="grid gap-[6px]">
        <span className="font-sans font-semibold text-[13px] leading-[18px] text-ink">Resposta</span>
        <textarea
          rows={3}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full min-h-[80px] p-3 rounded-md border border-line-strong bg-surface font-sans text-[15px] leading-[22px] text-ink resize-y focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-soft)] focus:outline-0"
        />
      </label>
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
