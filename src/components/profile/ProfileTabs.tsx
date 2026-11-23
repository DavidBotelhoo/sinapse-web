"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, User } from "lucide-react";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/perfil", label: "Conta", icon: User },
  { href: "/perfil/assinatura", label: "Assinatura", icon: Crown },
] as const;

/** "Conta" e "Assinatura": links entre as duas rotas, com o visual das abas (sn-tabs). */
export function ProfileTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Seções do perfil" className="flex md:inline-flex md:w-fit gap-1 p-1 rounded-md bg-surface-2">
      {TABS.map((t) => {
        const active = pathname === t.href;
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 md:flex-none inline-flex items-center justify-center gap-2 h-control-sm px-[14px] rounded-sm no-underline",
              "font-sans font-semibold text-[14px] leading-none whitespace-nowrap",
              "transition-[background-color,color,box-shadow] duration-(--dur-fast) ease-out [&_svg]:size-[18px]",
              active ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
            )}
          >
            <Icon aria-hidden strokeWidth={1.75} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
