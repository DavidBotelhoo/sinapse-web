"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Landing e telas de conta (entrar, criar conta, redefinir senha) ficam sempre no tema claro.
 * O `forcedTheme` não grava no localStorage: ao entrar no app, volta a escolha da pessoa.
 */
const LIGHT_ONLY_ROUTES = new Set(["/", "/entrar", "/criar-conta", "/redefinir-senha"]);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const forcedTheme = LIGHT_ONLY_ROUTES.has(pathname) ? "light" : undefined;

  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem forcedTheme={forcedTheme}>
      {children}
    </NextThemesProvider>
  );
}
