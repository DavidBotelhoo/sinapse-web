"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ChipProps = {
  selected?: boolean;
  role?: "radio" | "button";
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role" | "children">;

const base =
  "inline-flex items-center gap-[6px] h-control-sm px-[14px] border border-line-strong rounded-full " +
  "bg-surface text-ink font-sans font-semibold text-[14px] leading-none whitespace-nowrap cursor-pointer " +
  "transition-colors duration-(--dur-fast) ease-out hover:bg-surface-2 " +
  "[&_svg]:size-4";

const on = "bg-primary-soft border-primary text-on-primary-soft hover:bg-primary-soft";

export function Chip({ selected = false, role = "button", children, className, type = "button", ...rest }: ChipProps) {
  const ariaProps =
    role === "radio" ? { role, "aria-checked": selected } : { "aria-pressed": selected };
  return (
    <button type={type} className={cn(base, selected && on, className)} {...ariaProps} {...rest}>
      {selected ? <Check aria-hidden strokeWidth={1.75} /> : null}
      {children}
    </button>
  );
}

export type RemovableChipProps = {
  children: ReactNode;
  onRemove: () => void;
  removeLabel?: string;
  className?: string;
};

export function RemovableChip({ children, onRemove, removeLabel, className }: RemovableChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[6px] h-control-sm pl-[14px] pr-[6px] border border-primary rounded-full",
        "bg-primary-soft text-on-primary-soft font-sans font-semibold text-[14px] leading-none whitespace-nowrap",
        className,
      )}
    >
      {children}
      <button
        type="button"
        aria-label={removeLabel ?? "Remover filtro"}
        onClick={onRemove}
        className="grid place-items-center size-6 rounded-full bg-transparent text-current cursor-pointer hover:bg-surface [&_svg]:size-[14px]"
      >
        <X aria-hidden strokeWidth={1.75} />
      </button>
    </span>
  );
}

export function Chips({ children, className, label, group }: { children: ReactNode; className?: string; label?: string; group?: "radio" | "checkbox" }) {
  const groupProps =
    group === "radio"
      ? { role: "radiogroup", "aria-label": label }
      : group === "checkbox"
        ? { role: "group", "aria-label": label }
        : undefined;
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...groupProps}>
      {children}
    </div>
  );
}
