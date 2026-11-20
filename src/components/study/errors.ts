import { isApiError } from "@/lib/api/base";

/** Mensagem curta para quando a API não monta a sessão. */
export function startSessionError(err: unknown): string {
  if (isApiError(err)) {
    if (err.status === 422) return "Nada para estudar nessa seleção agora.";
    if (err.status === 403) return "Sua assinatura não está ativa. Veja em Perfil e assinatura.";
    if (err.status === 404) return "Um dos decks não está mais disponível. Recarregue a página.";
  }
  return "Não foi possível começar a sessão. Tente de novo.";
}
