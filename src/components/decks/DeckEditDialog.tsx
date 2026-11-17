"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { DeckForm, type DeckFormValues } from "./DeckForm";
import { useCourseQuery } from "@/lib/api/courses";
import type { DeckDetail } from "@/lib/api/decks";
import { isApiError } from "@/lib/api/base";

export type DeckEditDialogProps = {
  open: boolean;
  deck: DeckDetail;
  onClose: () => void;
  onSave: (values: { name: string; year: number; subjectIds: ReadonlyArray<string> }) => Promise<void>;
};

export function DeckEditDialog(props: DeckEditDialogProps) {
  if (!props.open) return null;
  return <DeckEditDialogBody {...props} />;
}

function DeckEditDialogBody({ deck, onClose, onSave }: DeckEditDialogProps) {
  const course = useCourseQuery();
  const [values, setValues] = useState<DeckFormValues>({
    name: deck.name,
    year: deck.year,
    subjectIds: deck.subjects.map((s) => s.id),
    visibility: deck.visibility,
  });
  const [saving, setSaving] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const years = course.data ? Array.from({ length: course.data.years }, (_, i) => i + 1) : [];
  const subjects = course.data?.subjects ?? [];

  async function submit() {
    setTopError(null);
    setNameError(undefined);
    if (!values.name.trim()) {
      setNameError("Dê um nome ao deck.");
      return;
    }
    if (values.year === null) {
      setTopError("Escolha o ano do curso.");
      return;
    }
    if (values.subjectIds.length === 0) {
      setTopError("Escolha pelo menos uma matéria.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        year: values.year,
        subjectIds: values.subjectIds,
      });
      onClose();
    } catch (err) {
      setTopError(isApiError(err) ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Editar deck"
      description="Nome, ano e matérias do deck."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={submit} loading={saving} loadingText="Salvando…">
            Salvar
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
      <DeckForm
        years={years}
        subjects={subjects}
        value={values}
        onChange={setValues}
        showVisibility={false}
        nameError={nameError}
      />
    </Dialog>
  );
}
