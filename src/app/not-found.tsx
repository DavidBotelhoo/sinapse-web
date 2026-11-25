import type { Metadata } from "next";
import { StatusPage } from "@/components/app/StatusPage";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Página não encontrada · Sinapse",
};

/** 404 de qualquer rota, no lugar da página padrão do Next (em inglês). */
export default function NotFound() {
  return (
    <StatusPage
      title="Página não encontrada"
      body="O endereço pode ter mudado, ou o deck foi excluído ou deixou de ser público."
      actions={<ButtonLink href="/inicio">Ir para o início</ButtonLink>}
    />
  );
}
