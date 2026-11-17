"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  labelledBy?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  labelledBy,
}: DialogProps) {
  const autoId = useId();
  const titleId = labelledBy ?? `${autoId}-title`;
  const descId = description ? `${autoId}-desc` : undefined;
  const ref = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    // focus first focusable
    const first = ref.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
    return () => {
      lastFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && ref.current) {
        const nodes = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0]!;
        const last = nodes[nodes.length - 1]!;
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !ref.current.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const onScrimClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const sizeClasses =
    size === "sm"
      ? "max-w-[400px]"
      : size === "lg"
        ? "max-w-[640px]"
        : "max-w-[480px]";

  return createPortal(
    <div
      aria-hidden={!open}
      onMouseDown={onScrimClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-scrim p-0 sm:p-4"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          "relative w-full",
          sizeClasses,
          "max-sm:rounded-t-xl sm:rounded-xl",
          "bg-surface shadow-lg",
          "flex flex-col gap-4 p-6",
          "max-h-[90dvh] overflow-y-auto",
        )}
      >
        <div className="grid gap-[2px]">
          <h2
            id={titleId}
            className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink"
          >
            {title}
          </h2>
          {description ? (
            <p
              id={descId}
              className="m-0 font-sans font-medium text-[13px] leading-[18px] text-ink-muted"
            >
              {description}
            </p>
          ) : null}
        </div>
        {children}
        {footer ? <div className="flex justify-end gap-2 flex-wrap">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "primary",
  loading,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
            loadingText={confirmLabel}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
