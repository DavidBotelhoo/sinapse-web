"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { isApiError } from "@/lib/api/base";
import { useCreateSession } from "@/lib/api/study";
import { startSessionError } from "@/components/study/errors";

/** "Estudar este deck" / "Estudar agora": monta a sessão do deck e abre a tela de foco. */
export function useStartDeckSession(deckId: string) {
  const router = useRouter();
  const create = useCreateSession();
  const [navigating, startNavigation] = useTransition();

  function start() {
    create.mutate(
      { deckIds: [deckId], limit: 20, order: "DUE_FIRST" },
      { onSuccess: (s) => startNavigation(() => router.push(`/estudar/sessao/${s.sessionId}`)) },
    );
  }

  const error = create.isError
    ? isApiError(create.error) && create.error.status === 422
      ? "Nada para estudar neste deck agora."
      : startSessionError(create.error)
    : null;

  return { start, starting: create.isPending || (create.isSuccess && navigating), error };
}
