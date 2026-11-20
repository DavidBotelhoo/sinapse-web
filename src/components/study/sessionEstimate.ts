import type { SessionLimit } from "@/lib/api/study";

type Option = { dueToday: number; overdue: number; newCount: number };

export type SessionEstimate = {
  /** Cards que a sessão vai ter: a API monta atrasados, depois os de hoje, depois os novos, e corta no limite. */
  cards: number;
  pending: number;
  available: number;
};

/**
 * Prévia de "Sua sessão". Cards agendados para o futuro não entram numa sessão, então
 * o máximo é atrasados + hoje + novos. Matérias que dividem um deck podem contar o mesmo
 * card duas vezes; a API decide o número final.
 */
export function estimateSession(selected: ReadonlyArray<Option>, limit: SessionLimit): SessionEstimate {
  const pendingAll = selected.reduce((acc, o) => acc + o.overdue + o.dueToday, 0);
  const available = selected.reduce((acc, o) => acc + o.overdue + o.dueToday + o.newCount, 0);
  const cards = limit == null ? available : Math.min(limit, available);
  return { cards, pending: Math.min(pendingAll, cards), available };
}
