import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type StatCardTone = "brand" | "accent";

export type StatCardProps = {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  tone?: StatCardTone;
  trend?: { direction: "up" | "down" | "flat"; label: ReactNode };
  footer?: ReactNode;
  /**
   * Arranjo no celular (tela 04): "split" põe rótulo e valor à esquerda e o rodapé à direita (Streak);
   * "inline" põe o valor na linha do rótulo (Taxa de acerto). Sem isso, empilha como no desktop.
   */
  mobileLayout?: "split" | "inline";
  className?: string;
};

const iconTones: Record<StatCardTone, string> = {
  brand: "bg-primary-soft text-on-primary-soft",
  accent: "bg-accent-soft text-on-accent-soft",
};

/** Unidade ao lado do número ("12 dias", "6 h 40 min"). */
export function StatUnit({ children }: { children: ReactNode }) {
  return (
    <span className="ml-[3px] mr-[6px] last:mr-0 font-sans font-semibold text-[15px] leading-none tracking-normal text-ink-muted">
      {children}
    </span>
  );
}

export function StatCard({
  icon,
  label,
  value,
  unit,
  tone = "brand",
  trend,
  footer,
  mobileLayout,
  className,
}: StatCardProps) {
  return (
    <section
      className={cn(
        "grid content-start gap-2 min-w-0 p-4 md:p-5 rounded-lg border border-line bg-surface",
        mobileLayout === "split" &&
          "max-md:flex max-md:flex-wrap max-md:items-center max-md:justify-between max-md:gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-2",
          mobileLayout === "split" && "max-md:gap-1",
          mobileLayout === "inline" && "max-md:flex max-md:items-center max-md:justify-between max-md:gap-3",
        )}
      >
        <div className="flex items-center gap-2 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
          <span
            className={cn(
              "grid place-items-center size-8 shrink-0 rounded-[10px] [&_svg]:size-[18px]",
              iconTones[tone],
            )}
            aria-hidden
          >
            {icon}
          </span>
          {label}
        </div>
        <div
          className={cn(
            "flex items-baseline mt-1 font-display font-bold text-stat-value tabular-nums text-ink",
            "max-md:text-[26px] max-md:leading-[30px]",
            mobileLayout && "max-md:mt-0",
          )}
        >
          {value}
          {unit ? <StatUnit>{unit}</StatUnit> : null}
        </div>
      </div>
      {trend ? (
        <div
          className={cn(
            "flex items-center gap-1 font-sans font-medium text-[12px] leading-4",
            trend.direction === "up" ? "text-success" : "text-ink-muted",
          )}
        >
          {trend.direction === "up" ? (
            <ArrowUpRight aria-hidden strokeWidth={1.75} className="size-[14px]" />
          ) : trend.direction === "down" ? (
            <ArrowDownRight aria-hidden strokeWidth={1.75} className="size-[14px]" />
          ) : null}
          {trend.label}
        </div>
      ) : null}
      {footer ? <div className={cn("mt-1", mobileLayout && "max-md:mt-0")}>{footer}</div> : null}
    </section>
  );
}

export type WeekStripProps = {
  days: ReadonlyArray<{ letter: string; done?: boolean; today?: boolean }>;
  className?: string;
};

export function WeekStrip({ days, className }: WeekStripProps) {
  return (
    <div className={cn("flex gap-[6px]", className)} aria-hidden>
      {days.map((d, i) => (
        <span
          key={i}
          className={cn(
            "grid place-items-center size-6 rounded-full font-sans font-bold text-[11px] leading-none",
            d.done ? "bg-accent text-on-accent" : "bg-surface-2 text-ink-muted",
            d.today && "shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-accent-ink)]",
          )}
        >
          {d.letter}
        </span>
      ))}
    </div>
  );
}

export type SparkProps = {
  bars: ReadonlyArray<{ height: number; today?: boolean }>;
  className?: string;
};

export function Spark({ bars, className }: SparkProps) {
  return (
    <div className={cn("flex items-end gap-1 h-8", className)} aria-hidden>
      {bars.map((b, i) => (
        <span
          key={i}
          style={{ height: `${Math.max(3, b.height)}%` }}
          className={cn(
            "flex-1 min-h-[3px] rounded-[3px]",
            b.today ? "bg-primary" : "bg-primary-soft",
          )}
        />
      ))}
    </div>
  );
}

export type ProgressBarProps = {
  value: number;
  tone?: "brand" | "accent";
  label?: string;
  className?: string;
};

export function ProgressBar({ value, tone = "brand", label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("relative h-[6px] rounded-sm bg-surface-2 overflow-hidden", className)}
    >
      <span
        style={{ width: `${clamped}%` }}
        className={cn(
          "block h-full rounded-[inherit] transition-[width] duration-(--dur-slow) ease-out",
          tone === "accent" ? "bg-accent" : "bg-primary",
        )}
      />
    </div>
  );
}

export function StatsGrid({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "grid grid-cols-2 gap-3 md:gap-4",
        "md:[grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]",
        className,
      )}
    >
      {children}
    </section>
  );
}
