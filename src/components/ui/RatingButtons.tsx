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
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "1") {
        e.preventDefault();
        onRate("again");
      } else if (e.key === "2") {
        e.preventDefault();
        onRate("hard");
      } else if (e.key === "3") {
        e.preventDefault();
        onRate("easy");
      }
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
            className={cn(
              "flex flex-col items-center justify-center gap-[2px] min-h-14 px-3 rounded-lg",
              "border-[1.5px] border-transparent font-sans font-bold text-[15px] leading-5 cursor-pointer",
              "transition-[border-color,transform] duration-(--dur-fast) ease-[var(--ease-spring)]",
              "hover:border-current active:scale-[0.96]",
              r.classes,
            )}
          >
            <span className="flex items-center gap-2">
              <Icon aria-hidden strokeWidth={1.75} className="size-[18px]" />
              {r.label}
              <Kbd>{r.key}</Kbd>
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
