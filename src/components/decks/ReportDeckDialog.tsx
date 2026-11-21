"use client";

import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { isApiError } from "@/lib/api/base";
import { useReportDeck, type ReportReason } from "@/lib/api/community";
import { cn } from "@/lib/cn";

const DETAILS_MAX = 500;

const REASONS: ReadonlyArray<{ value: ReportReason; label: string }> = [
  { value: "WRONG_CONTENT", label: "Conteúdo errado" },
  { value: "COPYRIGHT", label: "Direitos autorais" },
  { value: "OFFENSIVE", label: "Ofensivo" },
  { value: "SPAM", label: "Spam" },
  { value: "OTHER", label: "Outro" },
];

const schema = z.object({
  reason: z.enum(["WRONG_CONTENT", "COPYRIGHT", "OFFENSIVE", "SPAM", "OTHER"], {
    error: "Escolha um motivo.",
  }),
  details: z.string().max(DETAILS_MAX, `Use no máximo ${DETAILS_MAX} caracteres.`).optional(),
});

type Values = z.infer<typeof schema>;

export type ReportDeckDialogProps = {
  open: boolean;
  deckId: string;
  onClose: () => void;
  /** Depois de enviar: quem abriu mostra "Denúncia enviada…". */
  onReported: () => void;
};

/** "Denunciar deck": motivo e detalhes opcionais, no estilo do modal de trocar senha (tela 25). */
export function ReportDeckDialog(props: ReportDeckDialogProps) {
  // Monta só aberto: cada abertura começa com o formulário limpo.
  return props.open ? <ReportDeckDialogBody {...props} /> : null;
}

function ReportDeckDialogBody({ open, deckId, onClose, onReported }: ReportDeckDialogProps) {
  const formId = useId();
  const report = useReportDeck();
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { details: "" } });

  const details = useWatch({ control, name: "details" }) ?? "";

  const submit = handleSubmit((values) => {
    report.mutate(
      { id: deckId, reason: values.reason, details: values.details },
      {
        onSuccess: () => {
          onClose();
          onReported();
        },
        onError: (err) => {
          if (isApiError(err) && err.status === 404) {
            setError("root", { message: "Este deck não está mais disponível." });
          } else if (isApiError(err) && err.fields.details) {
            setError("details", { message: err.fields.details });
          } else {
            setError("root", { message: "Não foi possível enviar a denúncia. Tente de novo." });
          }
        },
      },
    );
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Denunciar deck"
      description="A moderação analisa cada denúncia. Quem publicou não fica sabendo quem denunciou."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={report.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={report.isPending} loadingText="Enviando">
            Enviar denúncia
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="grid gap-4">
        <fieldset
          className="m-0 p-0 border-0 grid gap-1"
          aria-describedby={errors.reason ? `${formId}-reason-error` : undefined}
        >
          <legend className="mb-2 p-0 font-sans font-semibold text-[13px] leading-[18px] text-ink">Motivo</legend>
          {REASONS.map((r) => (
            <label
              key={r.value}
              className={cn(
                "group flex items-center gap-3 min-h-control px-3 -mx-3 rounded-md cursor-pointer",
                "font-sans font-medium text-[15px] leading-[22px] text-ink hover:bg-surface-2",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-[-2px] has-focus-visible:outline-focus",
              )}
            >
              <input type="radio" value={r.value} {...register("reason")} className="sr-only" />
              <span
                aria-hidden
                className={cn(
                  "grid place-items-center size-[18px] shrink-0 rounded-full border-[1.5px] border-line-strong",
                  "transition-colors duration-(--dur-fast) group-has-checked:border-primary",
                )}
              >
                <span className="size-2 rounded-full bg-transparent group-has-checked:bg-primary" />
              </span>
              {r.label}
            </label>
          ))}
          {errors.reason ? (
            <p id={`${formId}-reason-error`} role="alert" className="m-0 mt-1 font-sans font-medium text-[13px] leading-[18px] text-danger">
              {errors.reason.message}
            </p>
          ) : null}
        </fieldset>

        <label className="grid gap-[6px]">
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-sans font-semibold text-[13px] leading-[18px] text-ink">Detalhes (opcional)</span>
            <span className="font-sans font-medium text-[12px] leading-4 tabular-nums text-ink-muted">
              {details.length}/{DETAILS_MAX}
            </span>
          </span>
          <textarea
            rows={3}
            maxLength={DETAILS_MAX}
            {...register("details")}
            aria-invalid={errors.details ? true : undefined}
            className={cn(
              "w-full min-h-[88px] p-3 rounded-md border border-line-strong bg-surface resize-y",
              "font-sans text-[15px] leading-[22px] text-ink placeholder:text-ink-faint",
              "focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-soft)] focus:outline-0",
            )}
            placeholder="Conte o que está errado, se quiser."
          />
          {errors.details ? (
            <span role="alert" className="font-sans font-medium text-[13px] leading-[18px] text-danger">
              {errors.details.message}
            </span>
          ) : null}
        </label>

        {errors.root ? (
          <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
            {errors.root.message}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
