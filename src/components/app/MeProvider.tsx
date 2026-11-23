"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { useMe, useUpdateMe, type Me } from "@/lib/api/useMe";
import type { ThemeValue } from "@/components/ui/ThemeToggle";

const MeContext = createContext<Me | null>(null);

/**
 * O usuário logado para as telas do app, a partir do que o layout buscou no servidor. Fica no
 * cache ["me"]: salvar o nome, trocar a foto ou mudar a assinatura atualiza todo mundo junto.
 * Ao entrar, aplica o tema salvo na conta (a escolha acompanha a pessoa entre aparelhos).
 */
export function MeProvider({ initial, children }: { initial: Me; children: ReactNode }) {
  const { data } = useMe(initial);
  const { setTheme } = useTheme();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    setTheme(initial.theme === "DARK" ? "dark" : initial.theme === "LIGHT" ? "light" : "system");
  }, [initial.theme, setTheme]);

  return <MeContext.Provider value={data ?? initial}>{children}</MeContext.Provider>;
}

export function useCurrentUser(): Me {
  const me = useContext(MeContext);
  if (!me) throw new Error("useCurrentUser fora do MeProvider");
  return me;
}

/** Pode estudar e importar (assinatura ativa, em teste, com prazo de pagamento ou vitalícia). */
export function useHasAccess(): boolean {
  return useCurrentUser().subscription.hasAccess;
}

/** Salva na conta o tema escolhido no ThemeToggle. Se falhar, o tema local continua. */
export function usePersistTheme() {
  const update = useUpdateMe();
  const { mutate } = update;
  return useCallback(
    (value: ThemeValue) => mutate({ theme: value === "dark" ? "DARK" : "LIGHT" }),
    [mutate],
  );
}
