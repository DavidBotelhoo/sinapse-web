import type { ReactNode } from "react";
import { Wordmark } from "./Wordmark";

export type StatusPageProps = {
  title: string;
  body: string;
  actions: ReactNode;
};

/** Página de aviso fora do app (404 e erro inesperado): marca no topo e a mensagem no centro. */
export function StatusPage({ title, body, actions }: StatusPageProps) {
  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      <header className="flex items-center px-5 py-5 md:px-10 md:py-6">
        <Wordmark href="/" size="lg" />
      </header>
      <main className="flex-1 grid place-items-center px-5 pb-16">
        <div className="grid justify-items-center gap-3 max-w-[440px] text-center">
          <h1 className="m-0 font-display font-bold text-title-1 text-ink text-balance">{title}</h1>
          <p className="m-0 mb-3 font-sans text-body text-ink-muted text-pretty">{body}</p>
          <div className="flex flex-wrap justify-center gap-3">{actions}</div>
        </div>
      </main>
    </div>
  );
}
