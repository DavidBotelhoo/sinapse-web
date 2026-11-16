"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SegmentedTabItem<V extends string> = {
  value: V;
  label: ReactNode;
  count?: number;
  icon?: ReactNode;
};

export type SegmentedTabsProps<V extends string> = {
  value: V;
  onChange: (value: V) => void;
  items: ReadonlyArray<SegmentedTabItem<V>>;
  variant?: "line" | "block";
  ariaLabel?: string;
  as?: "tabs" | "radio";
  className?: string;
};

export function SegmentedTabs<V extends string>({
  value,
  onChange,
  items,
  variant = "line",
  ariaLabel,
  as = "tabs",
  className,
}: SegmentedTabsProps<V>) {
  const listRef = useRef<HTMLDivElement>(null);

  function focusByIndex(i: number) {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-tab]");
    if (!buttons || buttons.length === 0) return;
    const idx = ((i % buttons.length) + buttons.length) % buttons.length;
    buttons[idx]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const buttons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-tab]") ?? [],
    );
    const i = buttons.indexOf(target as HTMLButtonElement);
    if (i < 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusByIndex(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusByIndex(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusByIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusByIndex(buttons.length - 1);
    }
  }

  return (
    <div
      ref={listRef}
      role={as === "tabs" ? "tablist" : "radiogroup"}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "gap-1 p-1 rounded-md bg-surface-2 max-w-full",
        variant === "block" ? "flex w-auto" : "inline-flex w-fit overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.value === value;
        const ariaProps =
          as === "tabs"
            ? { role: "tab", "aria-selected": selected, tabIndex: selected ? 0 : -1 }
            : { role: "radio", "aria-checked": selected, tabIndex: selected ? 0 : -1 };
        return (
          <button
            key={item.value}
            data-tab
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex items-center gap-2 h-control-sm px-[14px] rounded-sm font-sans font-semibold text-[14px] leading-none whitespace-nowrap cursor-pointer",
              "transition-[background-color,color,box-shadow] duration-(--dur-fast) ease-out",
              "[&_svg]:size-[18px]",
              selected
                ? "bg-surface text-ink shadow-sm"
                : "bg-transparent text-ink-muted hover:text-ink",
              variant === "block" && "flex-1 justify-center",
            )}
            {...ariaProps}
          >
            {item.icon}
            {item.label}
            {typeof item.count === "number" ? (
              <span
                className={cn(
                  "inline-block min-w-6 h-5 px-[6px] rounded-full font-sans font-bold text-[12px] leading-5 text-center tabular-nums",
                  selected ? "bg-primary-soft text-on-primary-soft" : "bg-transparent text-ink-muted",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
