import { cn } from "@/lib/cn";
import type { CardItem } from "@/lib/api/cards";

type Tone = "today" | "late" | "neutral" | "outline" | "onSelected";

const tones: Record<Tone, string> = {
  today: "bg-primary-soft text-on-primary-soft",
  late: "bg-accent-soft text-on-accent-soft",
  neutral: "bg-surface-2 text-ink-muted",
  // "Em N dias" e "Dominado" (dk-st--dias): só o contorno.
  outline: "bg-transparent text-ink-muted shadow-[inset_0_0_0_1px_var(--color-line-strong)]",
  // Dentro de um tile selecionado (fundo primary-soft).
  onSelected: "bg-surface text-ink",
};

export type StatusPillProps =
  /** Situação de um deck (fx-due): "5 atrasados", "15 para hoje" ou "Em dia". */
  | { kind: "deck"; dueToday: number; overdue: number; onSelected?: boolean; className?: string }
  /** Situação de um card (dk-st): "Revisar hoje", "Atrasado", "Em 4 dias", "Novo" ou "Dominado". */
  | { kind: "card"; status: CardItem["status"]; dueInDays?: number | null; className?: string };

/** As pílulas de situação são um componente só, com uma variante para deck e outra para card. */
export function StatusPill(props: StatusPillProps) {
  const [tone, label] = props.kind === "deck" ? deckStatus(props) : cardStatus(props);
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-[10px] rounded-full font-sans font-semibold text-[12px] leading-none whitespace-nowrap",
        tones[tone],
        props.className,
      )}
    >
      {label}
    </span>
  );
}

function deckStatus({ dueToday, overdue, onSelected }: { dueToday: number; overdue: number; onSelected?: boolean }): [Tone, string] {
  if (overdue > 0) return ["late", `${overdue} atrasado${overdue === 1 ? "" : "s"}`];
  if (dueToday > 0) return [onSelected ? "onSelected" : "today", `${dueToday} para hoje`];
  return ["neutral", "Em dia"];
}

function cardStatus({ status, dueInDays }: { status: CardItem["status"]; dueInDays?: number | null }): [Tone, string] {
  switch (status) {
    case "DUE_TODAY":
      return ["today", "Revisar hoje"];
    case "OVERDUE":
      return ["late", "Atrasado"];
    case "MASTERED":
      return ["outline", "Dominado"];
    case "SCHEDULED":
      return ["outline", typeof dueInDays === "number" ? `Em ${dueInDays} ${dueInDays === 1 ? "dia" : "dias"}` : "Agendado"];
    default:
      return ["neutral", "Novo"];
  }
}
