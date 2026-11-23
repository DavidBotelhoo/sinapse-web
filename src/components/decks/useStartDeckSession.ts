"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { isApiError } from "@/lib/api/base";
import { useCreateSession } from "@/lib/api/study";
import { startSessionError } from "@/components/study/errors";
import { useAccessGate } from "@/components/billing/useAccessGate";

/**
 * "Estudar este deck" / "Estudar agora": monta a sessão do deck e abre a tela de foco. Sem
 * assinatura ativa, `needsSubscription` liga na hora do clique e a tela mostra o SubscriptionNotice.
 */
export function useStartDeckSession(deckId: string) {
  const router = useRouter();
  const create = useCreateSession();
  const gate = useAccessGate();
  const [navigating, startNavigation] = useTransition();
  const [needsSubscription, setNeedsSubscription] = useState(false);

  function start() {
    if (gate.blocked) return setNeedsSubscription(true);
    create.mutate(
      { deckIds: [deckId], limit: 20, order: "DUE_FIRST" },
      {
        onSuccess: (s) => startNavigation(() => router.push(`/estudar/sessao/${s.sessionId}`)),
        onError: (err) => gate.handle(err) && setNeedsSubscription(true),
      },
    );
  }

  const error = create.isError
    ? isApiError(create.error) && create.error.status === 422
      ? "Nada para estudar neste deck agora."
      : startSessionError(create.error)
    : null;

  return { start, starting: create.isPending || (create.isSuccess && navigating), error, needsSubscription };
}
