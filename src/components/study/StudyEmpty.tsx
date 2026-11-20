import { Layers, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** /estudar sem flashcards salvos (tela 09). */
export function StudyEmpty() {
  return (
    <div className="grid gap-7 md:gap-8 max-md:min-h-[calc(100dvh-var(--spacing-bottom-nav)-6rem)] max-md:grid-rows-[auto_1fr]">
      <header className="grid gap-1">
        <h1 className="m-0 font-display text-title-1 text-ink">Estudar</h1>
        <p className="m-0 text-ink-muted max-md:hidden">Escolha o que revisar agora.</p>
      </header>
      <section className="grid place-items-center md:min-h-[560px] md:rounded-xl md:border md:border-line md:bg-surface">
        <EmptyState
          title="Monte seu primeiro deck para começar a estudar"
          body="Você ainda não tem flashcards salvos. Importe um PDF ou Word com suas perguntas, ou salve um deck pronto da Comunidade."
          primaryAction={
            <ButtonLink href="/flashcards" variant="primary" iconLeft={<Layers aria-hidden strokeWidth={1.75} />}>
              Ir para Flashcards
            </ButtonLink>
          }
          secondaryAction={
            <ButtonLink href="/comunidade" variant="secondary" iconLeft={<Users aria-hidden strokeWidth={1.75} />}>
              Explorar a Comunidade
            </ButtonLink>
          }
        />
      </section>
    </div>
  );
}
