"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { PasswordField, TextField, Form } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/client";
import { isApiError } from "@/lib/api/base";
import { loginSchema, type LoginValues } from "./schemas";

export function LoginForm({ focusOnMount }: { focusOnMount?: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const [topError, setTopError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (focusOnMount) emailRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  const mutation = useMutation({
    mutationFn: async (values: LoginValues) => {
      const { data } = await api.POST("/v1/auth/login", { body: values });
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      if (data) queryClient.setQueryData(["me"], data);
      const next = params?.get("next") ?? "/inicio";
      const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/inicio";
      router.replace(safe);
    },
    onError: (err) => {
      if (!isApiError(err)) {
        setTopError("Não foi possível conectar. Tente de novo.");
        return;
      }
      if (err.status === 401) {
        setTopError("Email ou senha não conferem.");
        return;
      }
      if (Object.keys(err.fields).length > 0) {
        for (const [field, message] of Object.entries(err.fields)) {
          if (field === "email" || field === "password") {
            setError(field, { message });
          }
        }
        return;
      }
      setTopError(err.message);
    },
  });

  const { ref: emailRhfRef, ...emailProps } = register("email");

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
        {...emailProps}
        ref={(el) => {
          emailRhfRef(el);
          emailRef.current = el;
        }}
      />
      <PasswordField
        label="Senha"
        autoComplete="current-password"
        placeholder="Sua senha"
        error={errors.password?.message}
        action={
          <Link
            href="/redefinir-senha"
            className="text-primary underline underline-offset-4 hover:text-primary-hover"
          >
            Esqueci minha senha
          </Link>
        }
        {...register("password")}
      />
      <Button type="submit" variant="primary" block loading={isSubmitting || mutation.isPending} loadingText="Entrando…">
        Entrar
      </Button>
    </Form>
  );
}
