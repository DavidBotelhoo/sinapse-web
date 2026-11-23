"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export type ThemeValue = "light" | "dark";

export type ThemeToggleProps = {
  /** Depois de trocar o tema no navegador (ex.: salvar na conta com PATCH /me). */
  onChange?: (value: ThemeValue) => void;
  className?: string;
};

export function ThemeToggle({ onChange, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Guarda contra hydration mismatch do next-themes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const current: ThemeValue = resolvedTheme === "dark" ? "dark" : "light";

  function select(value: ThemeValue) {
    if (value === current) return;
    setTheme(value);
    onChange?.(value);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tema"
      data-value={mounted ? current : undefined}
      className={cn(
        "relative grid grid-cols-2 p-1 rounded-md bg-surface-2",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-sm bg-surface shadow-sm",
          "transition-transform duration-(--dur-base) ease-out",
          mounted && current === "dark" ? "translate-x-full" : "translate-x-0",
        )}
      />
      <ThemeOption value="light" current={mounted ? current : null} onSelect={() => select("light")} />
      <ThemeOption value="dark" current={mounted ? current : null} onSelect={() => select("dark")} />
    </div>
  );
}

function ThemeOption({
  value,
  current,
  onSelect,
}: {
  value: "light" | "dark";
  current: "light" | "dark" | null;
  onSelect: () => void;
}) {
  const label = value === "light" ? "Claro" : "Escuro";
  const Icon = value === "light" ? Sun : Moon;
  const selected = current === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "relative z-1 flex items-center justify-center gap-[6px] h-9 rounded-sm bg-transparent cursor-pointer",
        "font-sans font-semibold text-[14px] leading-none",
        selected ? "text-ink" : "text-ink-muted hover:text-ink",
        "[&_svg]:size-[18px]",
      )}
    >
      <Icon aria-hidden strokeWidth={1.75} />
      {label}
    </button>
  );
}

export type CompactThemeToggleProps = {
  className?: string;
};

export function CompactThemeToggle({ className }: CompactThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Guarda contra hydration mismatch do next-themes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const current = resolvedTheme === "dark" ? "dark" : "light";
  return (
    <div
      role="radiogroup"
      aria-label="Aparência"
      className={cn("inline-flex gap-2", className)}
    >
      {(["light", "dark"] as const).map((v) => {
        const Icon = v === "light" ? Sun : Moon;
        const selected = mounted && current === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(v)}
            className={cn(
              "inline-flex items-center justify-center gap-2 h-control px-4 rounded-md cursor-pointer",
              "font-sans font-semibold text-[14px] border",
              selected
                ? "bg-primary-soft border-primary text-on-primary-soft"
                : "bg-surface border-line-strong text-ink hover:bg-surface-2",
              "[&_svg]:size-[18px]",
            )}
          >
            <Icon aria-hidden strokeWidth={1.75} />
            {v === "light" ? "Claro" : "Escuro"}
          </button>
        );
      })}
    </div>
  );
}
