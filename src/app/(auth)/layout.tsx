import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Wordmark } from "@/components/app/Wordmark";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** Telas 02 e 03: no desktop, a marca no canto; no celular, "Voltar" para a landing. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      <header className="flex items-center px-2 pt-3 md:px-10 md:py-6">
        {/* No wrapper: o inline-flex do Wordmark ganharia do hidden (o cn() não resolve o conflito). */}
        <div className="hidden md:block">
          <Wordmark href="/" size="lg" />
        </div>
        <ButtonLink href="/" variant="ghost" size="sm" className="md:hidden" iconLeft={<ChevronLeft aria-hidden strokeWidth={1.75} />}>
          Voltar
        </ButtonLink>
      </header>
      <main className="flex-1 flex flex-col md:items-center md:justify-center px-4 pt-1 pb-8 md:px-8 md:pt-4 md:pb-16">
        <div className="w-full max-w-[960px]">{children}</div>
      </main>
    </div>
  );
}
