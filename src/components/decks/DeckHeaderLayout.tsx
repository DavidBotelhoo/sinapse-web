import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

export type DeckHeaderLayoutProps = {
  back: { href: string; label: string };
  year: number;
  subjects: ReadonlyArray<{ id: string; name: string }>;
  title: string;
  /** Itens de metadados ("120 cards", "por Marina"…), cada um num <span>. */
  meta: ReactNode;
  /** Ação principal: "Estudar este deck" ou "Salvar deck". No celular ocupa a largura toda. */
  primary: ReactNode;
  /** Favorito e menu "…". No celular ficam no topo, ao lado da seta. */
  side?: ReactNode;
  className?: string;
};

/**
 * Cabeçalho do deck (telas 19, 22 e 23). Uma só árvore, reorganizada por grid-areas:
 * no celular, seta e menu no topo e o botão principal embaixo, na largura toda; no desktop,
 * o link de voltar em cima e as ações à direita do título.
 */
export function DeckHeaderLayout({
  back,
  year,
  subjects,
  title,
  meta,
  primary,
  side,
  className,
}: DeckHeaderLayoutProps) {
  return (
    <header
      className={cn(
        "grid items-center gap-x-2 gap-y-3",
        "[grid-template-columns:minmax(0,1fr)_auto] [grid-template-areas:'back_side'_'info_info'_'main_main']",
        "md:items-end md:[grid-template-columns:minmax(0,1fr)_auto_auto] md:[grid-template-areas:'back_back_back'_'info_main_side']",
        className,
      )}
    >
      <Link
        href={back.href}
        aria-label={`Voltar para ${back.label}`}
        className={cn(
          "[grid-area:back] justify-self-start inline-flex items-center gap-1 rounded-full no-underline",
          "font-sans font-semibold text-[14px] leading-none text-ink md:text-ink-muted hover:bg-surface-2 hover:text-ink",
          "max-md:size-control-sm max-md:justify-center max-md:-ml-2",
          "md:h-control-sm md:px-3 md:-ml-3 md:rounded-sm [&_svg]:size-5 md:[&_svg]:size-[18px]",
        )}
      >
        <ArrowLeft aria-hidden strokeWidth={1.75} />
        <span className="max-md:hidden">{back.label}</span>
      </Link>

      {side ? <div className="[grid-area:side] flex items-center gap-1 md:gap-2 max-md:-mr-2">{side}</div> : null}

      <div className="[grid-area:info] min-w-0 flex flex-col gap-[10px] max-md:mt-1 md:mr-3">
        <div className="flex flex-wrap gap-[6px]">
          <Tag>{year}º ano</Tag>
          {subjects.map((s) => (
            <Tag key={s.id} tone="brand">
              {s.name}
            </Tag>
          ))}
        </div>
        <h1 className="m-0 font-display font-bold text-[24px] leading-[30px] md:text-[32px] md:leading-[38px] tracking-[-0.01em] text-ink text-balance">
          {title}
        </h1>
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-4 gap-y-[6px] font-sans font-medium text-[14px] leading-5 text-ink-muted",
            "[&>span]:inline-flex [&>span]:items-center [&>span]:gap-[6px] [&_svg]:size-4 [&_b]:font-semibold [&_b]:text-ink",
          )}
        >
          {meta}
        </div>
      </div>

      <div className="[grid-area:main] max-md:mt-4 max-md:[&>*]:w-full max-md:[&>*]:h-[52px] max-md:[&>*]:text-[16px]">
        {primary}
      </div>
    </header>
  );
}

/** Classes do botão de ícone do topo: com borda no desktop, só o ícone no celular (sn-iconbtn). */
export const deckIconButtonClass =
  "max-md:size-control-sm max-md:w-control-sm max-md:rounded-full max-md:border-transparent max-md:bg-transparent";
