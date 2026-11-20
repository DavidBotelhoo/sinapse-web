"use client";

import { useEffect } from "react";
import { Check, Minus, X } from "lucide-react";
import { Kbd } from "./Button";
import { cn } from "@/lib/cn";

export type Rating = "again" | "hard" | "easy";

export type RatingButtonsProps = {
  onRate: (r: Rating) => void;
  disabled?: boolean;
  intervals?: Partial<Record<Rating, string>>;
  keyboardEnabled?: boolean;
  className?: string;
};

const ratings: ReadonlyArray<{
  value: Rating;
  label: string;
  icon: typeof X;
  key: "1" | "2" | "3";
  classes: string;
}> = [
  { value: "again", label: "Errei", icon: X, key: "1", classes: "bg-again-soft text-on-again-soft" },
  { value: "hard", label: "Difícil", icon: Minus, key: "2", classes: "bg-hard-soft text-on-hard-soft" },
  { value: "easy", label: "Fácil", icon: Check, key: "3", classes: "bg-easy-soft text-on-easy-soft" },
];

const byKey: Record<string, Rating> = { "1": "again", "2": "hard", "3": "easy" };

export function RatingButtons({
  onRate,
  disabled,
  intervals,
  keyboardEnabled = true,
  className,
}: RatingButtonsProps) {
  useEffect(() => {
    if (!keyboardEnabled || disabled) return;
    function onKey(e: KeyboardEvent) {
      if (e.repeat || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      const rating = byKey[e.key];
      if (!rating) return;
      e.preventDefault();
      onRate(rating);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onRate, disabled, keyboardEnabled]);

  return (
    <div
      role="group"
      aria-label="Como você foi?"
      className={cn("grid grid-cols-3 gap-3", className)}
    >
      {ratings.map((r) => {
        const Icon = r.icon;
        return (
          <button
            key={r.value}
            type="button"
            disabled={disabled}
            onClick={() => onRate(r.value)}
            aria-keyshortcuts={r.key}
            className={cn(
              "flex flex-col items-center justify-center gap-[2px] min-h-16 md:min-h-14 px-3 rounded-lg",
              "border-[1.5px] border-transparent font-sans font-bold text-[15px] leading-5 cursor-pointer",
              "transition-[border-color,transform] duration-(--dur-fast) ease-[var(--ease-spring)]",
              "hover:border-current active:scale-[0.96] disabled:cursor-default",
              r.classes,
            )}
          >
            <span className="flex flex-col md:flex-row items-center gap-[2px] md:gap-2">
              <Icon aria-hidden strokeWidth={1.75} className="size-5 md:size-[18px]" />
              {r.label}
              <span className="max-md:hidden [@media(hover:none)]:hidden ml-1 inline-flex">
                <Kbd>{r.key}</Kbd>
              </span>
            </span>
            {intervals?.[r.value] ? (
              <span className="font-sans font-medium text-[11px] leading-none opacity-70">
                {intervals[r.value]}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
