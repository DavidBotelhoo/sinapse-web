"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useHasAccess } from "@/components/app/MeProvider";
import { isApiError } from "@/lib/api/base";
import { meKey, type Me } from "@/lib/api/useMe";

/** 403 SUBSCRIPTION_REQUIRED: estudar e importar sem assinatura ativa (conta só leitura). */
export function isSubscriptionRequired(err: unknown): boolean {
  return isApiError(err) && err.code === "SUBSCRIPTION_REQUIRED";
}

/**
 * Estudar e importar dependem da assinatura. `blocked` vem de ["me"]; `handle(err)` cobre o acesso
 * que venceu com a página aberta: marca a conta como sem acesso, busca de novo e devolve true.
 */
export function useAccessGate() {
  const hasAccess = useHasAccess();
  const qc = useQueryClient();

  const handle = useCallback(
    (err: unknown) => {
      if (!isSubscriptionRequired(err)) return false;
      qc.setQueryData<Me>(meKey, (prev) =>
        prev ? { ...prev, subscription: { ...prev.subscription, hasAccess: false } } : prev,
      );
      void qc.invalidateQueries({ queryKey: meKey });
      return true;
    },
    [qc],
  );

  return { blocked: !hasAccess, handle };
}
