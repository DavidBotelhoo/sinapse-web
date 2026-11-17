import { ProgressBar } from "@/components/ui/StatCard";
import type { DeckDetail } from "@/lib/api/decks";
import { cn } from "@/lib/cn";

export type DeckStatsProps = {
  stats: DeckDetail["myStats"];
  className?: string;
};

export function DeckStats({ stats, className }: DeckStatsProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-3 m-0",
        className,
      )}
    >
      <Stat label="Domínio" value={<><span>{stats.masteryPct}</span><small className="font-sans font-semibold text-[15px] text-ink-muted ml-[2px]">%</small></>}>
        <ProgressBar value={stats.masteryPct} label="Domínio" />
      </Stat>
      <Stat label="Para hoje" value={stats.dueToday + stats.overdue} />
      <Stat label="Novos" value={stats.newCount} />
      <Stat
        label="Taxa de acerto"
        value={
          stats.accuracy === null
            ? "—"
            : <>{Math.round(stats.accuracy)}<small className="font-sans font-semibold text-[15px] text-ink-muted ml-[2px]">%</small></>
        }
      />
    </dl>
  );
}

function Stat({
  label,
  value,
  children,
}: {
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2 p-5 rounded-lg border border-line bg-surface">
      <dt className="m-0 font-sans font-medium text-[13px] leading-[18px] text-ink-muted">{label}</dt>
      <dd className="m-0 font-display font-bold text-stat-value tabular-nums text-ink flex items-baseline">
        {value}
      </dd>
      {children}
    </div>
  );
}
