"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, PasswordField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/client";
import { isApiError } from "@/lib/api/base";
import { resetSchema, type ResetValues } from "./schemas";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [topError, setTopError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    mode: "onBlur",
    defaultValues: { password: "", confirm: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: ResetValues) => {
      await api.POST("/v1/auth/reset-password", {
        body: { token, password: values.password },
      });
    },
    onSuccess: () => setDone(true),
    onError: (err) => {
      if (!isApiError(err)) {
        setTopError("Não foi possível conectar. Tente de novo.");
        return;
      }
      if (err.code === "INVALID_TOKEN" || err.code === "TOKEN_EXPIRED") {
        setTopError("Esse link expirou. Peça um novo em Esqueci minha senha.");
        return;
      }
      if (Object.keys(err.fields).length > 0) {
        for (const [field, message] of Object.entries(err.fields)) {
          if (field === "password") setError("password", { message });
        }
        return;
      }
      setTopError(err.message);
    },
  });

  if (done) {
    return (
      <div className="grid gap-4">
        <p className="m-0 font-sans text-body-lg text-ink">
          Senha redefinida. Já pode entrar com a nova senha.
        </p>
        <Button variant="primary" onClick={() => router.replace("/entrar")}>
          Ir para Entrar
        </Button>
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
      <PasswordField
        label="Nova senha"
        autoComplete="new-password"
        placeholder="Crie uma senha"
        hint="Mínimo de 8 caracteres."
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordField
        label="Repita a nova senha"
        autoComplete="new-password"
        placeholder="Repita a nova senha"
        error={errors.confirm?.message}
        {...register("confirm")}
      />
      <Button type="submit" variant="primary" block loading={isSubmitting || mutation.isPending} loadingText="Salvando…">
        Redefinir senha
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
