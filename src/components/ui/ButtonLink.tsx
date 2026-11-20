import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./buttonStyles";
import { cn } from "@/lib/cn";

export type ButtonLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
    iconLeft?: ReactNode;
    children: ReactNode;
  };

/** Link com cara de botão: navegação que o design desenha como `sn-btn`. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  block,
  iconLeft,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses({ variant, size, block }), "[&_svg]:size-5", className)} {...rest}>
      {iconLeft ? <span className="inline-flex shrink-0">{iconLeft}</span> : null}
      {children}
    </Link>
  );
}
