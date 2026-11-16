"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import {
  FieldRow,
  Form,
  PasswordField,
  TextField,
} from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/client";
import { isApiError } from "@/lib/api/base";
import { registerSchema, type RegisterValues } from "./schemas";

export function RegisterForm({ focusOnMount }: { focusOnMount?: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const [topError, setTopError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  useEffect(() => {
    if (focusOnMount) firstNameRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  const mutation = useMutation({
    mutationFn: async (values: RegisterValues) => {
      const { data } = await api.POST("/v1/auth/register", { body: values });
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      if (data) queryClient.setQueryData(["me"], data);
      router.replace("/inicio");
    },
    onError: (err) => {
      if (!isApiError(err)) {
        setTopError("Não foi possível conectar. Tente de novo.");
        return;
      }
      if (err.code === "EMAIL_TAKEN" || err.status === 409) {
        setError("email", {
          message: "Esse email já tem conta. Entre ou recupere a senha.",
        });
        return;
      }
      if (Object.keys(err.fields).length > 0) {
        for (const [field, message] of Object.entries(err.fields)) {
          if (
            field === "firstName" ||
            field === "lastName" ||
            field === "email" ||
            field === "password"
          ) {
            setError(field, { message });
          }
        }
        return;
      }
      setTopError(err.message);
    },
  });

  const { ref: firstNameRhfRef, ...firstNameProps } = register("firstName");

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
      <FieldRow>
        <TextField
          label="Nome"
          autoComplete="given-name"
          placeholder="Ana"
          error={errors.firstName?.message}
          {...firstNameProps}
          ref={(el) => {
            firstNameRhfRef(el);
            firstNameRef.current = el;
          }}
        />
        <TextField
          label="Sobrenome"
          autoComplete="family-name"
          placeholder="Souza"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </FieldRow>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="voce@faculdade.edu.br"
        leftIcon={<Mail strokeWidth={1.75} />}
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordField
        label="Senha"
        autoComplete="new-password"
        placeholder="Crie uma senha"
        hint="Mínimo de 8 caracteres."
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" variant="primary" block loading={isSubmitting || mutation.isPending} loadingText="Criando conta…">
        Criar conta
      </Button>
      <p className="m-0 font-sans font-medium text-[12px] leading-4 text-ink-muted">
        Ao criar a conta você aceita os{" "}
        <a href="#termos" className="text-primary underline underline-offset-4">Termos</a> e a{" "}
        <a href="#privacidade" className="text-primary underline underline-offset-4">Política de Privacidade</a>.
      </p>
    </Form>
  );
}
