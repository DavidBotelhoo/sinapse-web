import { CloudUpload, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** "Criar novo deck" com "Importar arquivo" (tela 04). */
export function CreateDeckBanner() {
  return (
    <section
      aria-labelledby="home-criar"
      className={
        "grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 p-6 rounded-lg border-[1.5px] border-dashed border-line-strong bg-surface " +
        "md:flex md:flex-wrap md:gap-5"
      }
    >
      <span aria-hidden className="grid place-items-center size-12 rounded-full bg-primary text-on-primary [&_svg]:size-6">
        <Plus strokeWidth={1.75} />
      </span>
      {/* No celular, título ao lado do +, texto e botão embaixo; no desktop, tudo numa linha. */}
      <div className="contents md:flex md:flex-col md:gap-[2px] md:flex-[1_1_260px] md:min-w-0">
        <h2 id="home-criar" className="m-0 font-display font-semibold text-[18px] leading-6 text-ink">
          Criar novo deck
        </h2>
        <p className="m-0 col-span-2 text-ink-muted">
          Importe um PDF ou Word com perguntas e respostas. O Sinapse separa os cards para você revisar.
        </p>
      </div>
      <ButtonLink
        href="/flashcards/novo"
        variant="secondary"
        className="col-span-2 max-md:w-full"
        iconLeft={<CloudUpload aria-hidden strokeWidth={1.75} />}
      >
        Importar arquivo
      </ButtonLink>
    </section>
  );
}
