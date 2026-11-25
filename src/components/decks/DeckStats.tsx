import { ProgressBar } from "@/components/ui/StatCard";
import type { DeckDetail } from "@/lib/api/decks";
import { cn } from "@/lib/cn";

export type DeckStatsProps = {
  stats: DeckDetail["myStats"];
  className?: string;
};

/** Números do deck (dk-stats): 4 colunas no desktop, 2 no celular. */
export function DeckStats({ stats, className }: DeckStatsProps) {
  return (
    <dl className={cn("grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-3 m-0", className)}>
      <Stat label="Domínio" value={<>{stats.masteryPct}<Unit>%</Unit></>}>
        {/* Segundo dd do mesmo termo: o <dl> só aceita dt e dd dentro de cada grupo. */}
        <dd className="m-0">
          <ProgressBar value={stats.masteryPct} label="Domínio" />
        </dd>
      </Stat>
      <Stat label="Para hoje" value={stats.dueToday + stats.overdue} />
      <Stat label="Novos" value={stats.newCount} />
      <Stat label="Taxa de acerto" value={stats.accuracy === null ? "—" : `${Math.round(stats.accuracy)}%`} />
    </dl>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  return <small className="ml-[3px] font-sans font-semibold text-[14px] leading-none text-ink-muted">{children}</small>;
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
    <div className="flex flex-col gap-[6px] p-[14px] md:p-4 rounded-lg border border-line bg-surface">
      <dt className="m-0 font-sans font-medium text-[13px] leading-[18px] text-ink-muted">{label}</dt>
      <dd className="m-0 flex items-baseline font-display font-bold text-[22px] leading-[26px] md:text-[26px] md:leading-[30px] tabular-nums text-ink">
        {value}
      </dd>
      {children}
    </div>
  );
}
