"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/app/StatusPage";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** Erro inesperado ao renderizar uma tela. `retry` busca os dados de novo e renderiza outra vez. */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      title="Algo deu errado"
      body="Não foi possível carregar esta tela. Tente de novo; se continuar, volte daqui a pouco."
      actions={
        <>
          <ButtonLink href="/inicio" variant="secondary">
            Ir para o início
          </ButtonLink>
          <Button onClick={() => retry()}>Tentar de novo</Button>
        </>
      }
    />
  );
}
