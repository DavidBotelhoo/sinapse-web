"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

/** Campo de busca das listas (sn-search, 36px): Flashcards, Comunidade e cards do deck. */
export function SearchField({ value, onChange, placeholder, className }: SearchFieldProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 h-control-sm px-3 rounded-sm border border-line-strong bg-surface",
        "focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)]",
        className,
      )}
    >
      <Search aria-hidden strokeWidth={1.75} className="size-4 shrink-0 text-ink-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-0 border-0 font-sans text-[14px] leading-5 text-ink placeholder:text-ink-faint"
      />
    </label>
  );
}
