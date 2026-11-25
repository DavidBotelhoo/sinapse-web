"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/app/Wordmark";
import { AuthFlair } from "@/components/marketing/AuthFlair";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { cn } from "@/lib/cn";

const DUR_AUTH_MS = 680;

export type AuthMode = "login" | "signup";

export function AuthPanel({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [focusTarget, setFocusTarget] = useState<AuthMode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function switchTo(next: AuthMode) {
    if (next === mode) return;
    setMode(next);
    const path = next === "login" ? "/entrar" : "/criar-conta";
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", path);
      document.title = next === "login" ? "Entrar · Sinapse" : "Criar conta · Sinapse";
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFocusTarget(next), DUR_AUTH_MS);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isLogin = mode === "login";
  const isSignup = mode === "signup";

  return (
    <div
      data-mode={mode}
      className={cn(
        "w-full [perspective:1800px] [container-type:inline-size]",
      )}
    >
      {/* Marca no celular (@container ≤ 720px) */}
      <div className="@[720px]:hidden flex justify-center mb-6">
        <Wordmark size="md" />
      </div>

      <div
        className={cn(
          "relative grid grid-cols-1 @[720px]:grid-cols-2 min-h-0 @[720px]:min-h-[600px] overflow-visible @[720px]:overflow-hidden",
          "bg-transparent @[720px]:bg-surface @[720px]:rounded-xl @[720px]:shadow-lg",
          // mobile flip
          "[transform-style:preserve-3d] transition-transform duration-(--dur-auth) ease-[var(--ease-in-out)]",
          isSignup && "@max-[720px]:[transform:rotateY(180deg)]",
          "motion-reduce:transition-none",
        )}
      >
        {/* Cadastro */}
        <section
          aria-label="Criar conta"
          inert={!isSignup}
          className={cn(
            // Desktop (≥720px): metade esquerda, com transição de opacidade/translate
            "@[720px]:col-start-1 @[720px]:row-start-1 @[720px]:flex @[720px]:flex-col @[720px]:justify-center @[720px]:gap-6 @[720px]:p-10 @[720px]:min-w-0",
            "@[720px]:transition-[opacity,transform] @[720px]:duration-(--dur-auth) @[720px]:ease-out motion-reduce:@[720px]:transition-none",
            // Desktop inativo: some
            isLogin && "@[720px]:opacity-0 @[720px]:invisible @[720px]:-translate-x-6",
            isLogin &&
              "@[720px]:[transition:opacity_var(--dur-fast)_var(--ease-out),transform_var(--dur-auth)_var(--ease-out),visibility_0s_var(--dur-auth)]",
            isSignup && "@[720px]:opacity-100 @[720px]:visible @[720px]:translate-x-0",
            isSignup &&
              "@[720px]:[transition:opacity_var(--dur-base)_var(--ease-out)_calc(var(--dur-auth)_*_0.5),transform_var(--dur-auth)_var(--ease-out),visibility_0s]",
            // Mobile: card verso
            "@max-[720px]:col-start-1 @max-[720px]:row-start-1 @max-[720px]:self-start @max-[720px]:flex @max-[720px]:flex-col @max-[720px]:gap-5 @max-[720px]:p-8 @max-[720px]:px-6 @max-[720px]:rounded-xl @max-[720px]:bg-surface @max-[720px]:shadow-lg @max-[720px]:[backface-visibility:hidden] @max-[720px]:[transform:rotateY(180deg)]",
          )}
        >
          <AuthHeader title="Criar conta" subtitle="Leva menos de um minuto." />
          <RegisterForm focusOnMount={focusTarget === "signup"} />
          <SwitchFooter mode="signup" onSwitch={switchTo} />
        </section>

        {/* Login */}
        <section
          aria-label="Entrar"
          inert={!isLogin}
          className={cn(
            "@[720px]:col-start-2 @[720px]:row-start-1 @[720px]:flex @[720px]:flex-col @[720px]:justify-center @[720px]:gap-6 @[720px]:p-10 @[720px]:min-w-0",
            "@[720px]:transition-[opacity,transform] @[720px]:duration-(--dur-auth) @[720px]:ease-out motion-reduce:@[720px]:transition-none",
            isSignup && "@[720px]:opacity-0 @[720px]:invisible @[720px]:translate-x-6",
            isSignup &&
              "@[720px]:[transition:opacity_var(--dur-fast)_var(--ease-out),transform_var(--dur-auth)_var(--ease-out),visibility_0s_var(--dur-auth)]",
            isLogin && "@[720px]:opacity-100 @[720px]:visible @[720px]:translate-x-0",
            isLogin &&
              "@[720px]:[transition:opacity_var(--dur-base)_var(--ease-out)_calc(var(--dur-auth)_*_0.5),transform_var(--dur-auth)_var(--ease-out),visibility_0s]",
            "@max-[720px]:col-start-1 @max-[720px]:row-start-1 @max-[720px]:self-start @max-[720px]:flex @max-[720px]:flex-col @max-[720px]:gap-5 @max-[720px]:p-8 @max-[720px]:px-6 @max-[720px]:rounded-xl @max-[720px]:bg-surface @max-[720px]:shadow-lg @max-[720px]:[backface-visibility:hidden]",
          )}
        >
          <AuthHeader title="Entrar" subtitle="Que bom te ver de novo." />
          <LoginForm focusOnMount={focusTarget === "login"} />
          <SwitchFooter mode="login" onSwitch={switchTo} />
        </section>

        {/* Overlay (só no desktop). O botão do pitch é o jeito de trocar de modo com o teclado, então nada de aria-hidden aqui. */}
        <div
          className={cn(
            "hidden @[720px]:grid absolute z-2 top-0 bottom-0 left-0 w-1/2 overflow-hidden",
            "bg-primary text-on-primary",
            "transition-transform duration-(--dur-auth) ease-[var(--ease-in-out)] motion-reduce:transition-none",
            isSignup && "translate-x-full",
          )}
        >
          <AuthFlair />
          <Pitch
            mode="login"
            visible={isLogin}
            title="Novo por aqui?"
            body="Crie sua conta e transforme seus resumos em flashcards em poucos minutos."
            buttonLabel="Criar conta"
            onSwitch={() => switchTo("signup")}
          />
          <Pitch
            mode="signup"
            visible={isSignup}
            title="Já tem conta?"
            body="Entre e continue de onde parou. Sua sequência de estudos está te esperando."
            buttonLabel="Entrar"
            onSwitch={() => switchTo("login")}
          />
        </div>
      </div>
    </div>
  );
}

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="grid gap-2">
      <h1 className="m-0 font-display font-bold tracking-[-0.015em] @max-[720px]:text-title-1 @[720px]:text-display-lg text-ink">
        {title}
      </h1>
      <p className="m-0 font-sans text-ink-muted">{subtitle}</p>
    </div>
  );
}

function SwitchFooter({
  mode,
  onSwitch,
}: {
  mode: AuthMode;
  onSwitch: (next: AuthMode) => void;
}) {
  // No desktop esse pé some (fica no overlay). No celular aparece.
  const next: AuthMode = mode === "login" ? "signup" : "login";
  const prompt = mode === "login" ? "Ainda não tem conta?" : "Já tem conta?";
  const label = mode === "login" ? "Criar conta" : "Entrar";
  return (
    <p className="hidden @max-[720px]:block m-0 text-center text-ink-muted">
      {prompt}{" "}
      <button
        type="button"
        onClick={() => onSwitch(next)}
        className="text-primary font-semibold underline underline-offset-4 hover:text-primary-hover"
      >
        {label}
      </button>
    </p>
  );
}

function Pitch({
  mode,
  visible,
  title,
  body,
  buttonLabel,
  onSwitch,
}: {
  mode: AuthMode;
  visible: boolean;
  title: string;
  body: string;
  buttonLabel: string;
  onSwitch: () => void;
}) {
  return (
    <div
      inert={!visible}
      className={cn(
        "relative col-start-1 row-start-1 flex flex-col justify-between gap-6 p-10 max-w-full",
        "transition-[opacity,transform] duration-(--dur-auth) ease-[var(--ease-in-out)] motion-reduce:transition-none",
        visible ? "opacity-100 visible translate-x-0" : "opacity-0 invisible",
        !visible && mode === "signup" && "translate-x-10",
        !visible && mode === "login" && "-translate-x-10",
      )}
    >
      <Wordmark size="lg" tone="onPrimary" />
      <div className="grid gap-3 justify-items-start">
        <h2 className="m-0 font-display font-bold text-display-lg tracking-[-0.015em] text-balance">
          {title}
        </h2>
        <p className="m-0 mb-3 text-body-lg max-w-[34ch]">{body}</p>
        <Button variant="onPrimary" onClick={onSwitch}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
