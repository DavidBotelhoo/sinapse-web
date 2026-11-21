"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { Button } from "./Button";
import { Chip, RemovableChip } from "./Chip";
import { cn } from "@/lib/cn";

export type FilterOption = {
  value: string;
  label: string;
  /** Rótulo nos chips do popover ("2º"); o chip removível usa `label` ("2º ano"). */
  shortLabel?: string;
};

export type FilterDef = {
  id: string;
  label: string;
  options: ReadonlyArray<FilterOption>;
  selected: ReadonlyArray<string>;
  onChange: (selected: ReadonlyArray<string>) => void;
  variant?: "chips" | "search";
  singleValueLabel?: (value: string) => string;
};

export type FilterBarProps = {
  filters: ReadonlyArray<FilterDef>;
  onClearAll?: () => void;
  removedLabel?: (filterLabel: string, value: string) => string;
  className?: string;
  trailing?: ReactNode;
};

export function FilterBar({ filters, onClearAll, removedLabel, className, trailing }: FilterBarProps) {
  const activeCount = filters.reduce((n, f) => n + f.selected.length, 0);
  const activeItems = filters.flatMap((f) =>
    f.selected.map((v) => {
      const opt = f.options.find((o) => o.value === v);
      return { filterId: f.id, filterLabel: f.label, value: v, label: opt?.label ?? v, onChange: f.onChange, selected: f.selected };
    }),
  );
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((f) => (
        <FilterPopover key={f.id} filter={f} />
      ))}
      {activeCount > 0 ? (
        <>
          <span aria-hidden className="w-px h-6 mx-1 bg-line" />
          {activeItems.map((item) => (
            <RemovableChip
              key={`${item.filterId}-${item.value}`}
              removeLabel={
                removedLabel
                  ? removedLabel(item.filterLabel, item.label)
                  : `Remover filtro ${item.label}`
              }
              onRemove={() => item.onChange(item.selected.filter((v) => v !== item.value))}
            >
              {item.label}
            </RemovableChip>
          ))}
          {onClearAll ? (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Limpar filtros
            </Button>
          ) : null}
        </>
      ) : null}
      {trailing ? <div className="ml-auto">{trailing}</div> : null}
    </div>
  );
}

/** Rótulo do gatilho: "Ano do curso", "2º ano" ou "Matéria · 2". */
export function filterTriggerLabel(filter: FilterDef) {
  const n = filter.selected.length;
  if (n === 0) return filter.label;
  if (n === 1) {
    const v = filter.selected[0] ?? "";
    return filter.singleValueLabel
      ? filter.singleValueLabel(v)
      : (filter.options.find((o) => o.value === v)?.label ?? filter.label);
  }
  return `${filter.label} · ${n}`;
}

export type FilterTriggerProps = {
  label: ReactNode;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
  className?: string;
  "aria-controls"?: string;
  "aria-haspopup"?: "dialog";
  ref?: Ref<HTMLButtonElement>;
};

/** O chip que abre um filtro (sn-filter__trigger): popover no desktop, folha no celular. */
export function FilterTrigger({
  label,
  active,
  expanded,
  onClick,
  className,
  ref,
  ...aria
}: FilterTriggerProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={expanded}
      aria-pressed={active || undefined}
      onClick={onClick}
      {...aria}
      className={cn(
        "inline-flex shrink-0 items-center gap-[6px] h-control-sm px-[14px] rounded-full font-sans font-semibold text-[14px] leading-none cursor-pointer whitespace-nowrap",
        "border transition-colors duration-(--dur-fast) ease-out [&_svg]:size-4",
        active
          ? "bg-primary-soft border-primary text-on-primary-soft"
          : "bg-surface border-line-strong text-ink hover:bg-surface-2",
        className,
      )}
    >
      {label}
      <ChevronDown
        strokeWidth={1.75}
        aria-hidden
        className={cn("transition-transform duration-(--dur-fast) ease-out", expanded && "rotate-180")}
      />
    </button>
  );
}

function FilterPopover({ filter }: { filter: FilterDef }) {
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedCount = filter.selected.length;
  const triggerLabel = filterTriggerLabel(filter);

  function closeAndRestoreFocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative">
      <FilterTrigger
        ref={triggerRef}
        label={triggerLabel}
        active={selectedCount > 0}
        expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((v) => !v)}
      />
      {open ? (
        <FilterPopoverBody
          id={popoverId}
          filter={filter}
          triggerRef={triggerRef}
          onClose={closeAndRestoreFocus}
        />
      ) : null}
    </div>
  );
}

function FilterPopoverBody({
  id,
  filter,
  triggerRef,
  onClose,
}: {
  id: string;
  filter: FilterDef;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ReadonlyArray<string>>(filter.selected);
  const [query, setQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (popoverRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, triggerRef]);

  function toggle(value: string) {
    setDraft((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  const filtered =
    filter.variant === "search" && query
      ? filter.options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : filter.options;

  return (
    <div
      ref={popoverRef}
      id={id}
      role="dialog"
      aria-label={filter.label}
      className={cn(
        "absolute top-[calc(100%+8px)] left-0 z-20 min-w-[280px]",
        "grid gap-3 p-4 rounded-lg bg-surface border border-line shadow-md",
      )}
    >
      {filter.variant === "search" ? (
        <SearchList
          options={filtered}
          draft={draft}
          toggle={toggle}
          query={query}
          setQuery={setQuery}
        />
      ) : (
        <>
          <p className="m-0 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">{filter.label}</p>
          <ChipList options={filter.options} draft={draft} toggle={toggle} />
        </>
      )}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-line">
        <Button variant="ghost" size="sm" onClick={() => setDraft([])}>
          Limpar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            filter.onChange(draft);
            onClose();
          }}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
}

function ChipList({
  options,
  draft,
  toggle,
}: {
  options: ReadonlyArray<FilterOption>;
  draft: ReadonlyArray<string>;
  toggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o.value} selected={draft.includes(o.value)} onClick={() => toggle(o.value)} aria-label={o.label}>
          {o.shortLabel ?? o.label}
        </Chip>
      ))}
    </div>
  );
}

function SearchList({
  options,
  draft,
  toggle,
  query,
  setQuery,
}: {
  options: ReadonlyArray<FilterOption>;
  draft: ReadonlyArray<string>;
  toggle: (v: string) => void;
  query: string;
  setQuery: (q: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <label className="flex items-center gap-2 h-control-sm px-3 rounded-md border border-line-strong bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)]">
        <Search aria-hidden strokeWidth={1.75} className="size-4 text-ink-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar matéria"
          className="flex-1 min-w-0 bg-transparent outline-0 border-0 font-sans text-[14px] leading-5 text-ink placeholder:text-ink-faint"
        />
      </label>
      <ul role="listbox" aria-multiselectable className="grid gap-1 max-h-[240px] overflow-y-auto">
        {options.length === 0 ? (
          <li className="px-2 py-2 text-[13px] text-ink-muted">Nenhuma matéria encontrada</li>
        ) : (
          options.map((o) => {
            const selected = draft.includes(o.value);
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-checked={selected}
                  aria-selected={selected}
                  onClick={() => toggle(o.value)}
                  className={cn(
                    "flex items-center gap-2 w-full h-control-sm px-2 rounded-sm text-left font-sans text-[14px] cursor-pointer",
                    "hover:bg-surface-2",
                    selected ? "text-ink" : "text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "grid place-items-center size-5 rounded-[6px] border",
                      selected ? "bg-primary border-primary text-on-primary" : "border-line-strong text-transparent",
                    )}
                  >
                    <Check aria-hidden strokeWidth={2} className="size-[14px]" />
                  </span>
                  {o.label}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
