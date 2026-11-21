"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { base, iconOnlySizes, sizes, variants, type ButtonSize, type ButtonVariant } from "./buttonStyles";

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
  // Só ícone: quadrado, sem o padding do tamanho (px-5 com px-0 juntos, o px-5 vencia e esmagava o ícone).
  const sizeClasses = iconOnly ? iconOnlySizes[size] : sizes[size];

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
        sizeClasses,
        variants[variant],
        block && "w-full",
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
