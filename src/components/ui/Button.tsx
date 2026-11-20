"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { base, sizes, variants, type ButtonSize, type ButtonVariant } from "./buttonStyles";

export type { ButtonSize, ButtonVariant };

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  iconOnly?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    block,
    iconOnly,
    iconLeft,
    iconRight,
    loading,
    loadingText,
    children,
    className,
    type = "button",
    disabled,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const iconOnlyClasses = iconOnly ? (size === "sm" ? "w-control-sm px-0" : "w-control px-0") : "";

  if (iconOnly && !ariaLabel && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.warn("Button com iconOnly exige aria-label.");
  }

  return (
    <button
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        block && "w-full",
        iconOnlyClasses,
        loading && "pointer-events-none",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <>
          <LoaderCircle className="size-[18px] animate-spin" strokeWidth={1.75} aria-hidden />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {iconLeft ? <span className="inline-flex shrink-0">{iconLeft}</span> : null}
          {children}
          {iconRight ? <span className="inline-flex shrink-0">{iconRight}</span> : null}
        </>
      )}
    </button>
  );
});

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-grid place-items-center min-w-5 h-5 px-[5px] rounded-[6px]",
        "border border-current font-sans font-semibold text-[11px] leading-none",
        "[@media(hover:none)]:hidden",
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}
