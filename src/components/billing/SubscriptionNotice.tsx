import { Crown } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PaymentNotice } from "./PaymentNotice";

/**
 * Conta só leitura (sem assinatura ativa): estudar e importar mostram este aviso, no estilo do
 * aviso de pagamento (tela 27), e levam para a aba Assinatura.
 */
export function SubscriptionNotice({ what = "estudar e importar arquivos" }: { what?: string }) {
  return (
    <PaymentNotice
      role="alert"
      icon={<Crown strokeWidth={1.75} />}
      title="Sua assinatura não está ativa"
      action={
        <ButtonLink href="/perfil/assinatura" variant="secondary" size="sm" className="max-sm:w-full">
          Ver planos
        </ButtonLink>
      }
    >
      Seus decks continuam salvos. Assine para voltar a {what}.
    </PaymentNotice>
  );
}
