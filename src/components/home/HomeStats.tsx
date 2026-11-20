import { Clock, Flame, ListChecks, Target } from "lucide-react";
import { ProgressBar, Spark, StatCard, StatsGrid, StatUnit, WeekStrip } from "@/components/ui/StatCard";
import type { components } from "@/lib/api/schema";
import { num, plural } from "@/components/study/format";
import { daysBetween } from "./dates";

type MeStats = components["schemas"]["MeStatsDto"];

const LETTERS = ["S", "T", "Q", "Q", "S", "S", "D"];
const NAMES = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

function Short({ mobile, desktop }: { mobile: string; desktop: string }) {
  return (
    <>
      <span className="md:hidden">{mobile}</span>
      <span className="max-md:hidden">{desktop}</span>
    </>
  );
}

/** Os quatro StatCards da Início (tela 04). `today` é o dia de hoje do usuário ("AAAA-MM-DD"). */
export function HomeStats({ stats, today }: { stats: MeStats; today: string }) {
  const todayIndex = Math.min(6, Math.max(0, daysBetween(stats.weekStart, today)));
  const studiedNames = NAMES.filter((_, i) => stats.weekStudied[i]);

  const delta = stats.cardsDeltaPct;
  const trend =
    delta === null
      ? undefined
      : delta === 0
        ? { direction: "flat" as const, label: "Igual à semana passada" }
        : {
            direction: delta > 0 ? ("up" as const) : ("down" as const),
            label: (
              <Short
                mobile={`${Math.abs(delta)}% na semana`}
                desktop={`${Math.abs(delta)}% a ${delta > 0 ? "mais" : "menos"} que na semana passada`}
              />
            ),
          };

  const hours = Math.floor(stats.minutesThisWeek / 60);
  const minutes = stats.minutesThisWeek % 60;
  const maxMinutes = Math.max(1, ...stats.minutesPerDay);

  return (
    <StatsGrid aria-label="Seus números">
      <StatCard
        tone="accent"
        mobileLayout="split"
        className="max-md:col-span-2"
        icon={<Flame strokeWidth={1.75} />}
        label="Streak"
        value={stats.streak}
        unit={plural(stats.streak, "dia", "dias")}
        footer={
          <>
            <WeekStrip
              days={LETTERS.map((letter, i) => ({
                letter,
                done: stats.weekStudied[i],
                today: i === todayIndex,
              }))}
            />
            <span className="sr-only">
              {studiedNames.length > 0
                ? `Dias estudados nesta semana: ${studiedNames.join(", ")}.`
                : "Nenhum dia estudado nesta semana."}
            </span>
          </>
        }
      />
      <StatCard
        icon={<ListChecks strokeWidth={1.75} />}
        label={<Short mobile="Cards" desktop="Cards estudados" />}
        value={num(stats.cardsThisWeek)}
        trend={trend}
      />
      <StatCard
        icon={<Clock strokeWidth={1.75} />}
        label={<Short mobile="Horas" desktop="Horas estudadas" />}
        value={
          hours > 0 ? (
            <>
              {hours}
              <StatUnit>h</StatUnit>
              {minutes}
            </>
          ) : (
            minutes
          )
        }
        unit="min"
        footer={
          <div className="grid gap-2">
            <Spark
              className="max-md:h-6"
              bars={stats.minutesPerDay.map((m, i) => ({
                height: (m / maxMinutes) * 100,
                today: i === todayIndex,
              }))}
            />
            <span className="max-md:hidden font-sans font-medium text-[12px] leading-4 text-ink-muted">
              Nesta semana
            </span>
          </div>
        }
      />
      <StatCard
        mobileLayout="inline"
        className="max-md:col-span-2"
        icon={<Target strokeWidth={1.75} />}
        label="Taxa de acerto"
        value={stats.accuracy7d ?? "–"}
        unit={stats.accuracy7d === null ? undefined : "%"}
        footer={
          <div className="grid gap-2">
            <ProgressBar value={stats.accuracy7d ?? 0} label="Taxa de acerto" />
            <span className="font-sans font-medium text-[12px] leading-4 text-ink-muted">
              {stats.accuracy7d === null ? "Sem avaliações nos últimos 7 dias" : "Difícil + Fácil, últimos 7 dias"}
            </span>
          </div>
        }
      />
    </StatsGrid>
  );
}
