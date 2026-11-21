import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "danger"
  | "onPrimary";

export type ButtonSize = "sm" | "md" | "lg";

export const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold leading-none whitespace-nowrap cursor-pointer select-none " +
  "transition-[background-color,border-color,color,transform] duration-(--dur-fast) ease-out " +
  "active:scale-[0.98] rounded-md border";

export const sizes: Record<ButtonSize, string> = {
  sm: "h-control-sm px-4 text-[14px] rounded-sm",
  md: "h-control px-5 text-[15px]",
  lg: "h-[52px] px-6 text-[16px]",
};

export const iconOnlySizes: Record<ButtonSize, string> = {
  sm: "size-control-sm rounded-sm",
  md: "size-control",
  lg: "size-[52px]",
};

export const variants: Record<ButtonVariant, string> = {
  // A cor da borda fica em cada variante: com border-transparent na base, a do secundário perdia pela ordem do CSS.
  primary: "border-transparent bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border-line-strong bg-surface text-ink hover:bg-surface-2",
  ghost: "border-transparent bg-transparent text-ink hover:bg-surface-2",
  accent: "border-transparent bg-accent text-on-accent",
  danger: "border-transparent bg-transparent text-danger hover:bg-danger-soft",
  onPrimary: "bg-transparent text-on-primary border-current hover:bg-primary-hover",
};

/** As classes do botão, para links com cara de botão (`ButtonLink`). */
export function buttonClasses({
  variant = "primary",
  size = "md",
  block,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean } = {}) {
  return cn(base, sizes[size], variants[variant], block && "w-full", "no-underline");
}

