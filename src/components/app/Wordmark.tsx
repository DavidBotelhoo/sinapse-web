import Link from "next/link";
import { cn } from "@/lib/cn";

export type WordmarkProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "onPrimary";
  className?: string;
};

const sizes: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-[20px]",
  md: "text-[22px]",
  lg: "text-[26px]",
};

export function Wordmark({ href, size = "md", tone = "ink", className }: WordmarkProps) {
  const base = cn(
    "inline-flex items-baseline font-display font-extrabold leading-none tracking-[-0.02em] no-underline",
    "after:content-[''] after:w-[0.3em] after:h-[0.3em] after:ml-[0.06em] after:rounded-full after:bg-accent",
    tone === "onPrimary" ? "text-on-primary" : "text-ink",
    sizes[size],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={base}>
        Sinapse
      </Link>
    );
  }
  return <span className={base}>Sinapse</span>;
}
