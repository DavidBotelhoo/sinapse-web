"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Layers, Play, Settings, Users, type LucideIcon } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTodayCount } from "@/lib/api/stats";
import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  count?: number;
};

export function Sidebar({
  user,
  initialTodayCount,
}: {
  user: { firstName: string; lastName: string; avatarUrl?: string | null };
  initialTodayCount?: number;
}) {
  const pathname = usePathname();
  const { data: todayCount = 0 } = useTodayCount(initialTodayCount);

  const items: ReadonlyArray<Item> = [
    { href: "/inicio", label: "Início", icon: House },
    { href: "/estudar", label: "Estudar", icon: Play, count: todayCount > 0 ? todayCount : undefined },
    { href: "/flashcards", label: "Flashcards", icon: Layers },
    { href: "/comunidade", label: "Comunidade", icon: Users },
  ];

  return (
    <aside
      aria-label="Navegação principal"
      className={cn(
        "hidden md:flex sticky top-0 flex-col gap-8 h-dvh w-sidebar py-6 px-4",
        "border-r border-line bg-surface",
      )}
    >
      <div className="px-3 py-1">
        <Wordmark href="/inicio" />
      </div>
      <nav className="grid gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 h-control px-3 rounded-md font-sans font-semibold text-[15px] leading-none",
                "transition-colors duration-(--dur-fast) ease-out no-underline",
                active
                  ? "bg-primary-soft text-on-primary-soft"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                "[&_svg]:size-5",
              )}
            >
              <Icon aria-hidden strokeWidth={1.75} />
              {item.label}
              {typeof item.count === "number" ? (
                <span
                  className={cn(
                    "ml-auto inline-block min-w-7 h-6 px-2 rounded-full font-sans font-bold text-[12px] leading-6 text-center tabular-nums",
                    active ? "bg-primary text-on-primary" : "bg-primary-soft text-on-primary-soft",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto grid gap-3 pt-4 border-t border-line">
        <ThemeToggle />
        <Link
          href="/perfil"
          aria-current={isActive(pathname, "/perfil") ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 p-2 rounded-md no-underline text-ink",
            "transition-colors duration-(--dur-fast) ease-out",
            isActive(pathname, "/perfil") ? "bg-surface-2" : "hover:bg-surface-2",
            "[&_svg]:size-5 [&_svg]:text-ink-muted",
          )}
        >
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            src={user.avatarUrl ?? undefined}
            size="sm"
            decorative
          />
          <div className="flex-1 min-w-0 grid">
            <span className="font-sans font-semibold text-[14px] leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
              {user.firstName} {user.lastName}
            </span>
            <span className="font-sans font-medium text-[12px] leading-4 text-ink-muted">
              Perfil e assinatura
            </span>
          </div>
          <Settings aria-hidden strokeWidth={1.75} />
        </Link>
      </div>
    </aside>
  );
}

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/inicio") return pathname === "/inicio";
  return pathname === href || pathname.startsWith(`${href}/`);
}
