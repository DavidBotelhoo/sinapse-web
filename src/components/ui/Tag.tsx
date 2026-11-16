import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TagTone = "neutral" | "brand" | "accent" | "outline";

export type TagProps = {
  tone?: TagTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

const tones: Record<TagTone, string> = {
  neutral: "bg-surface-2 text-ink-muted",
  brand: "bg-primary-soft text-on-primary-soft",
  accent: "bg-accent-soft text-on-accent-soft",
  outline: "bg-transparent text-ink-muted inset-ring-1 inset-ring-line-strong",
};

export function Tag({ tone = "neutral", icon, children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-6 px-[10px] rounded-sm font-sans font-semibold text-[12px] leading-4 whitespace-nowrap",
        "[&_svg]:size-[14px]",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export type CountPillProps = {
  tone?: "neutral" | "brand" | "accent";
  children: ReactNode;
  className?: string;
};

export function CountPill({ tone = "brand", children, className }: CountPillProps) {
  const toneClass =
    tone === "accent"
      ? "bg-accent-soft text-on-accent-soft"
      : tone === "neutral"
        ? "bg-transparent text-ink-muted"
        : "bg-primary-soft text-on-primary-soft";
  return (
    <span
      className={cn(
        "inline-block min-w-7 h-6 px-2 rounded-full font-sans font-bold text-[12px] leading-6 text-center tabular-nums",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
