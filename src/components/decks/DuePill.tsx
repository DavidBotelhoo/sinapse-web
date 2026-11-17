import { cn } from "@/lib/cn";

export type DuePillProps = {
  dueToday: number;
  overdue: number;
  className?: string;
};

export function DuePill({ dueToday, overdue, className }: DuePillProps) {
  const base =
    "inline-flex items-center h-6 px-[10px] rounded-full font-sans font-semibold text-[12px] leading-none whitespace-nowrap";

  if (overdue > 0) {
    return (
      <span className={cn(base, "bg-accent-soft text-on-accent-soft", className)}>
        {overdue} atrasado{overdue === 1 ? "" : "s"}
      </span>
    );
  }
  if (dueToday > 0) {
    return (
      <span className={cn(base, "bg-primary-soft text-on-primary-soft", className)}>
        {dueToday} para hoje
      </span>
    );
  }
  return <span className={cn(base, "bg-surface-2 text-ink-muted", className)}>Em dia</span>;
}
