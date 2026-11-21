"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  Ellipsis,
  Flag,
  FileUp,
  Globe,
  Lock,
  Pencil,
  Trash2,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type BaseItem = {
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  variant?: "default" | "danger";
};

export type DeckMenuProps = {
  isMine: boolean;
  isPublic?: boolean;
  onEdit?: () => void;
  onTogglePublish?: () => void;
  onImportMore?: () => void;
  onDelete?: () => void;
  onRemoveSaved?: () => void;
  onReport?: () => void;
  /** Classes extras do botão "…" (sem borda no celular, no topo do cabeçalho). */
  triggerClassName?: string;
};

export function DeckMenu(props: DeckMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: BaseItem[] = [];
  if (props.isMine) {
    if (props.onEdit) items.push({ label: "Editar nome e matérias", icon: <Pencil strokeWidth={1.75} />, onSelect: props.onEdit });
    if (props.onTogglePublish)
      items.push(
        props.isPublic
          ? { label: "Tornar privado", icon: <Lock strokeWidth={1.75} />, onSelect: props.onTogglePublish }
          : { label: "Publicar na Comunidade", icon: <Globe strokeWidth={1.75} />, onSelect: props.onTogglePublish },
      );
    if (props.onImportMore) items.push({ label: "Importar mais cards", icon: <FileUp strokeWidth={1.75} />, onSelect: props.onImportMore });
    if (props.onDelete) items.push({ label: "Excluir deck", icon: <Trash2 strokeWidth={1.75} />, onSelect: props.onDelete, variant: "danger" });
  } else {
    if (props.onRemoveSaved)
      items.push({ label: "Remover dos meus flashcards", icon: <Bookmark strokeWidth={1.75} />, onSelect: props.onRemoveSaved });
    if (props.onReport)
      items.push({ label: "Denunciar deck", icon: <Flag strokeWidth={1.75} />, onSelect: props.onReport, variant: "danger" });
  }

  function selectItem(fn: () => void) {
    setOpen(false);
    triggerRef.current?.focus();
    fn();
  }

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        variant="secondary"
        iconOnly
        aria-label="Mais opções do deck"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={props.triggerClassName}
      >
        <Ellipsis strokeWidth={1.75} className="size-[18px]" />
      </Button>
      {open ? (
        <div
          ref={menuRef}
          id={id}
          role="menu"
          className={cn(
            "absolute top-[calc(100%+8px)] right-0 z-30 min-w-[240px]",
            "grid gap-1 p-2 rounded-lg bg-surface border border-line shadow-md",
          )}
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              onClick={() => selectItem(item.onSelect)}
              className={cn(
                "flex items-center gap-2 w-full h-control px-3 rounded-md text-left cursor-pointer",
                "font-sans font-semibold text-[14px] leading-none",
                item.variant === "danger"
                  ? "text-danger hover:bg-danger-soft"
                  : "text-ink hover:bg-surface-2",
                "[&_svg]:size-[18px]",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
