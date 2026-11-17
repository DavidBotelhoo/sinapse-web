import { cn } from "@/lib/cn";
import type { CardItem } from "@/lib/api/cards";

export type CardStatusPillProps = {
  status: CardItem["status"];
  dueInDays?: number | null;
  className?: string;
};

export function CardStatusPill({ status, dueInDays, className }: CardStatusPillProps) {
  const base =
    "inline-flex items-center h-6 px-[10px] rounded-full font-sans font-semibold text-[12px] leading-none whitespace-nowrap";

  if (status === "DUE_TODAY") {
    return <span className={cn(base, "bg-primary-soft text-on-primary-soft", className)}>Revisar hoje</span>;
  }
  if (status === "OVERDUE") {
    return <span className={cn(base, "bg-accent-soft text-on-accent-soft", className)}>Atrasado</span>;
  }
  if (status === "MASTERED") {
    return <span className={cn(base, "bg-primary-soft text-on-primary-soft", className)}>Dominado</span>;
  }
  if (status === "SCHEDULED") {
    return (
      <span className={cn(base, "bg-surface-2 text-ink-muted", className)}>
        {typeof dueInDays === "number" ? `Em ${dueInDays} ${dueInDays === 1 ? "dia" : "dias"}` : "Agendado"}
      </span>
    );
  }
  return <span className={cn(base, "bg-surface-2 text-ink-muted", className)}>Novo</span>;
}
