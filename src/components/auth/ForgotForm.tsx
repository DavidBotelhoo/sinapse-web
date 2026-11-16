"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { Form, TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/client";
import { isApiError } from "@/lib/api/base";
import { forgotSchema, type ForgotValues } from "./schemas";

export function ForgotForm() {
  const [sent, setSent] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: ForgotValues) => {
      await api.POST("/v1/auth/forgot-password", { body: values });
    },
    onSuccess: () => setSent(true),
    onError: (err) => {
      if (isApiError(err)) {
        setTopError(err.message);
      } else {
        setTopError("Não foi possível conectar. Tente de novo.");
      }
    },
  });

  if (sent) {
    return (
      <div className="grid gap-4">
        <p className="m-0 font-sans text-body-lg text-ink">
          Se existir uma conta com esse email, enviamos um link para redefinir a senha. Confira
          também a caixa de spam.
        </p>
        <Link
          href="/entrar"
          className="text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          Voltar para Entrar
        </Link>
      </div>
    );
  }

  return (
    <Form
      onSubmit={handleSubmit((values) => {
        setTopError(null);
        mutation.mutate(values);
      })}
    >
      {topError ? (
        <p
          role="alert"
          className="m-0 px-3 py-2 rounded-md bg-danger-soft text-danger font-sans font-medium text-[13px] leading-[18px]"
        >
          {topError}
        </p>
      ) : null}
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="voce@faculdade.edu.br"
        leftIcon={<Mail strokeWidth={1.75} />}
        error={errors.email?.message}
        {...register("email")}
      />
      <Button type="submit" variant="primary" block loading={isSubmitting || mutation.isPending} loadingText="Enviando…">
        Enviar link
      </Button>
      <p className="m-0 text-center font-sans text-body text-ink-muted">
        <Link
          href="/entrar"
          className="text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          Voltar para Entrar
        </Link>
      </p>
    </Form>
  );
}
