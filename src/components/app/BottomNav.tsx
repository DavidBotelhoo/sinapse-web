"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Layers, Play, User, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: "icon" | "play";
};

const items: ReadonlyArray<Item> = [
  { href: "/inicio", label: "Início", icon: House },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/estudar", label: "Estudar", icon: Play, variant: "play" },
  { href: "/comunidade", label: "Comunidade", icon: Users },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegação principal"
      data-sinapse-bottom-nav
      className={cn(
        "md:hidden fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 items-stretch h-bottom-nav px-2",
        "border-t border-line bg-surface",
        "pb-[env(safe-area-inset-bottom,0px)] box-content",
      )}
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        if (item.variant === "play") {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "grid justify-items-center content-end pb-[9px] gap-[2px] no-underline",
                "font-sans font-bold text-[11px] leading-[14px] text-ink",
              )}
            >
              <span
                className={cn(
                  "grid place-items-center size-play -mt-[26px] mb-[2px] rounded-full",
                  "bg-primary text-on-primary shadow-[0_0_0_6px_var(--color-bg),var(--sn-shadow-play)]",
                  "transition-[transform,background-color] duration-(--dur-fast)",
                  "[&_svg]:size-[26px] [&_svg]:fill-current",
                  "hover:bg-primary-hover active:scale-[0.96]",
                )}
                aria-hidden
              >
                <Icon strokeWidth={1.75} />
              </span>
              {item.label}
            </Link>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "grid justify-items-center content-center gap-[2px] no-underline",
              "font-sans font-semibold text-[11px] leading-[14px]",
              active ? "text-ink" : "text-ink-muted",
            )}
          >
            <span
              className={cn(
                "grid place-items-center w-[52px] h-[30px] rounded-full",
                "transition-colors duration-(--dur-base) ease-out",
                active && "bg-primary-soft text-on-primary-soft",
                "[&_svg]:size-5",
              )}
              aria-hidden
            >
              <Icon strokeWidth={1.75} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/inicio") return pathname === "/inicio";
  return pathname === href || pathname.startsWith(`${href}/`);
}
