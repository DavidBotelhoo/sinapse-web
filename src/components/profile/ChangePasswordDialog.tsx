"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { TextField } from "@/components/ui/TextField";
import { isApiError } from "@/lib/api/base";
import { useChangePassword } from "@/lib/api/useMe";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Digite sua senha atual."),
    newPassword: z.string().min(8, "Use pelo menos 8 caracteres.").max(100, "Senha muito longa."),
    confirm: z.string().min(1, "Repita a nova senha."),
  })
  .refine((v) => v.newPassword === v.confirm, { path: ["confirm"], message: "As senhas não são iguais." })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "Escolha uma senha diferente da atual.",
  });

type Values = z.infer<typeof schema>;

export type ChangePasswordDialogProps = {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
};

/** Trocar senha (tela 25): modal no desktop, folha presa ao fundo no celular. */
export function ChangePasswordDialog(props: ChangePasswordDialogProps) {
  // Monta só aberto: cada abertura começa limpa.
  return props.open ? <Body {...props} /> : null;
}

function Body({ open, onClose, onChanged }: ChangePasswordDialogProps) {
  const formId = useId();
  const change = useChangePassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const submit = handleSubmit((values) => {
    change.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          onClose();
          onChanged();
        },
        onError: (err) => {
          if (isApiError(err) && err.code === "CURRENT_PASSWORD_WRONG") {
            setError("currentPassword", { message: "A senha atual não confere." });
          } else if (isApiError(err) && err.code === "NEW_PASSWORD_SAME_AS_CURRENT") {
            setError("newPassword", { message: "Escolha uma senha diferente da atual." });
          } else if (isApiError(err) && err.fields.newPassword) {
            setError("newPassword", { message: "Use pelo menos 8 caracteres." });
          } else {
            setError("root", { message: "Não foi possível trocar a senha. Tente de novo." });
          }
        },
      },
    );
  });

  const lock = <Lock strokeWidth={1.75} />;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Trocar senha"
      size="form"
      description="Depois de salvar, você continua conectado neste aparelho."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={change.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={change.isPending} loadingText="Salvando">
            Salvar nova senha
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="grid gap-4">
        <TextField
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          leftIcon={lock}
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <TextField
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          leftIcon={lock}
          hint="Mínimo de 8 caracteres."
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <TextField
          label="Repita a nova senha"
          type="password"
          autoComplete="new-password"
          leftIcon={lock}
          error={errors.confirm?.message}
          {...register("confirm")}
        />
        {errors.root ? (
          <p role="alert" className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]">
            {errors.root.message}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
