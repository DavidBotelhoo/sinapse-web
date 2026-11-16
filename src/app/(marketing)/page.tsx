import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  CloudUpload,
  Flame,
  Layers,
  Play,
  Target,
} from "lucide-react";
import { Kbd } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { PlanCard, PlansGrid } from "@/components/ui/PlanCard";
import { ProgressBar, StatCard, WeekStrip } from "@/components/ui/StatCard";
import { Wordmark } from "@/components/app/Wordmark";
import { AuthFlair } from "@/components/marketing/AuthFlair";
import { cn } from "@/lib/cn";

export default function LandingPage() {
  return (
    <>
      <TopBar />
      <Hero />
      <HowItWorks />
      <ForWhom />
      <Plans />
      <CTA />
      <Footer />
    </>
  );
}

function TopBar() {
  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto max-w-[1200px] flex flex-wrap items-center gap-4 md:gap-6 px-5 md:px-8 py-[14px] md:py-[18px]">
        <Wordmark href="#topo" size="md" />
        <nav
          aria-label="Seções"
          className="hidden md:flex flex-wrap gap-7 ml-6 font-sans font-semibold text-[15px]"
        >
          <a href="#como-funciona" className="text-ink-muted hover:text-ink no-underline">
            Como funciona
          </a>
          <a href="#para-quem" className="text-ink-muted hover:text-ink no-underline">
            Para quem
          </a>
          <a href="#planos" className="text-ink-muted hover:text-ink no-underline">
            Planos
          </a>
        </nav>
        <div className="ml-auto flex gap-2 md:gap-3">
          <Link
            href="/entrar"
            className="inline-flex items-center justify-center gap-2 h-control-sm md:h-control px-4 md:px-5 rounded-sm md:rounded-md border border-line-strong bg-surface text-ink font-sans font-semibold text-[14px] md:text-[15px] no-underline hover:bg-surface-2"
          >
            Entrar
          </Link>
          <Link
            href="/criar-conta"
            className="inline-flex items-center justify-center gap-2 h-control-sm md:h-control px-4 md:px-5 rounded-sm md:rounded-md bg-primary text-on-primary font-sans font-semibold text-[14px] md:text-[15px] no-underline hover:bg-primary-hover"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="topo"
      className="mx-auto max-w-[1200px] px-5 md:px-8 pt-10 md:pt-[88px] pb-12 md:pb-24 flex flex-col md:flex-row flex-wrap items-center gap-10 md:gap-16"
    >
      <div className="flex-1 min-w-0 md:min-w-[460px] flex flex-col items-start gap-5 md:gap-6">
        <Tag tone="brand">Para estudantes de Medicina</Tag>
        <h1 className="m-0 font-display font-bold tracking-[-0.015em] md:tracking-[-0.02em] text-display-lg md:text-display-xl text-balance text-ink">
          Revise na hora certa. Lembre na prova.
        </h1>
        <p className="m-0 max-w-[34em] font-sans text-body-lg text-ink-muted">
          Importe seus resumos em PDF ou Word, estude com flashcards e deixe o Sinapse calcular
          quando cada card precisa voltar.
        </p>
        <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-3 mt-1 md:mt-2 w-full md:w-auto">
          <Link
            href="/criar-conta"
            className="inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-md bg-primary text-on-primary font-sans font-semibold text-[16px] no-underline hover:bg-primary-hover"
          >
            Criar conta
          </Link>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 h-[52px] md:h-[52px] px-6 rounded-md bg-transparent text-ink font-sans font-semibold text-[16px] no-underline hover:bg-surface-2 [&_svg]:size-[18px]"
          >
            Ver como funciona
            <ArrowRight aria-hidden strokeWidth={1.75} />
          </a>
        </div>
        <p className="m-0 w-full md:w-auto text-center md:text-left font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
          Do 1º ao 6º ano. No computador e no celular.
        </p>
      </div>
      <HeroArt />
    </section>
  );
}

function HeroArt() {
  return (
    <div
      aria-hidden
      className="flex-1 min-w-0 md:min-w-[520px] relative w-full md:h-[500px] flex flex-col md:block gap-4"
    >
      {/* Mobile accent streak chip */}
      <span className="md:hidden self-end mb-2 inline-flex items-center gap-[6px] h-8 px-3 rounded-sm bg-accent-soft text-on-accent-soft font-sans font-semibold text-[13px] shadow-md [&_svg]:size-4">
        <Flame aria-hidden strokeWidth={1.75} />
        12 dias seguidos
      </span>
      <div
        className={cn(
          "md:absolute md:left-6 md:top-[72px] md:w-[440px]",
          "flex flex-col gap-4 min-h-[230px] md:min-h-[280px] p-6 md:p-8",
          "rounded-xl border border-line bg-surface",
          "shadow-[0_-10px_0_-5px_var(--color-surface-2),0_-20px_0_-10px_var(--color-line),var(--sn-shadow-lg)]",
          "md:-rotate-[2.5deg]",
        )}
      >
        <div className="flex items-center justify-between gap-2 font-sans font-semibold text-[13px] leading-[18px] text-ink-muted">
          <span>Farmacologia · 2º ano</span>
          <Tag>Pergunta</Tag>
        </div>
        <p className="m-0 flex-1 flex items-center font-display font-semibold text-card-question text-ink text-pretty">
          Qual o principal mecanismo de ação da metformina?
        </p>
        <p className="hidden md:block m-0 text-center font-sans font-medium text-[12px] leading-4 text-ink-muted">
          Pense na resposta. Depois toque no card.
        </p>
      </div>
      <div
        aria-hidden
        className={cn(
          "md:absolute md:left-12 md:top-[404px] md:w-[420px]",
          "grid grid-cols-3 gap-3",
        )}
      >
        <span className="flex flex-col items-center justify-center gap-[2px] min-h-14 rounded-lg border-[1.5px] border-transparent bg-again-soft text-on-again-soft font-sans font-bold text-[15px]">
          Errei
        </span>
        <span className="flex flex-col items-center justify-center gap-[2px] min-h-14 rounded-lg border-[1.5px] border-transparent bg-hard-soft text-on-hard-soft font-sans font-bold text-[15px]">
          Difícil
        </span>
        <span className="flex flex-col items-center justify-center gap-[2px] min-h-14 rounded-lg border-[1.5px] border-transparent bg-easy-soft text-on-easy-soft font-sans font-bold text-[15px]">
          Fácil
        </span>
      </div>
      <div className="hidden md:block absolute right-0 top-0 w-[232px] shadow-md">
        <StatCard
          tone="accent"
          icon={<Flame />}
          label="Streak"
          value={12}
          unit="dias"
          footer={
            <WeekStrip
              days={[
                { letter: "S", done: true },
                { letter: "T", done: true },
                { letter: "Q", done: true },
                { letter: "Q", done: true },
                { letter: "S", done: true },
                { letter: "S", done: true },
                { letter: "D", done: true, today: true },
              ]}
            />
          }
        />
      </div>
      <div className="hidden md:block absolute right-6 top-[300px] w-[200px] shadow-md">
        <StatCard
          icon={<Target />}
          label="Taxa de acerto"
          value="78%"
          footer={<ProgressBar value={78} label="Taxa de acerto" />}
        />
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: CloudUpload,
      title: "1. Importe",
      body: "Envie um PDF ou Word com perguntas e respostas. O Sinapse separa os cards e monta o deck para você revisar antes de salvar.",
    },
    {
      icon: Play,
      title: "2. Estude",
      body: "Veja a pergunta, pense no seu tempo, vire o card e diga como foi: Errei, Difícil ou Fácil.",
    },
    {
      icon: CalendarDays,
      title: "3. Revise na hora certa",
      body: "Cada card volta quando você está prestes a esquecer. A agenda mostra o que vence em cada dia da semana.",
    },
  ];
  return (
    <section
      id="como-funciona"
      className="bg-surface border-y border-line"
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 md:py-24 flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col gap-2 md:gap-3 max-w-[640px]">
          <span className="font-sans font-semibold text-[13px] leading-[18px] text-primary">
            Como funciona
          </span>
          <h2 className="m-0 font-display font-bold text-[28px] md:text-display-lg leading-[34px] md:leading-[44px] tracking-[-0.01em] md:tracking-[-0.015em] text-ink">
            Três passos, todo dia
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex md:flex-col gap-4 md:gap-[14px] p-5 md:p-7 rounded-lg bg-bg border border-line"
              >
                <span
                  aria-hidden
                  className="grid place-items-center w-11 h-11 md:w-[52px] md:h-[52px] shrink-0 rounded-full bg-primary-soft text-on-primary-soft [&_svg]:size-5 md:[&_svg]:size-6"
                >
                  <Icon strokeWidth={1.75} />
                </span>
                <div className="flex flex-col gap-1 md:gap-2">
                  <h3 className="m-0 font-display font-semibold text-title-3 md:text-title-2 text-ink">
                    {step.title}
                  </h3>
                  <p className="m-0 font-sans text-body text-ink-muted">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ForWhom() {
  const lines = [
    "Decks organizados por ano do curso e por matéria.",
    "Comunidade para salvar decks prontos de outros estudantes.",
    "Agenda de revisão, streak, horas estudadas e taxa de acerto.",
    "Modo escuro para as madrugadas de estudo.",
  ];
  return (
    <section
      id="para-quem"
      className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 md:py-24 flex flex-col md:flex-row flex-wrap items-center gap-10 md:gap-16"
    >
      <div className="flex-1 min-w-0 md:min-w-[400px] flex flex-col gap-4 md:gap-5">
        <span className="font-sans font-semibold text-[13px] leading-[18px] text-primary">
          Para quem
        </span>
        <h2 className="m-0 font-display font-bold text-[28px] md:text-display-lg leading-[34px] md:leading-[44px] tracking-[-0.01em] md:tracking-[-0.015em] text-balance text-ink">
          Feito para a rotina de Medicina
        </h2>
        <ul className="mt-2 m-0 p-0 list-none flex flex-col gap-3 md:gap-4 font-sans text-body-lg">
          {lines.map((line) => (
            <li key={line} className="flex gap-3">
              <Check
                aria-hidden
                strokeWidth={1.75}
                className="size-5 mt-[3px] text-primary shrink-0"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        aria-hidden
        className="flex-1 min-w-0 md:min-w-[520px] w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"
      >
        <DecorativeDeck title="Farmacologia do sistema nervoso autônomo" year="2º ano" subject="Farmacologia" cards={84} mastery={62} />
        <DecorativeDeck title="Membro superior: músculos e inervação" year="1º ano" subject="Anatomia" cards={48} community="Marina" />
        <DecorativeDeck title="Neoplasias: conceitos gerais" year="3º ano" subject="Patologia" cards={12} todayLabel />
        <DecorativeDeck title="Fisiologia renal" year="2º ano" subject="Fisiologia" cards={58} mastery={35} />
      </div>
    </section>
  );
}

function DecorativeDeck({
  title,
  year,
  subject,
  cards,
  mastery,
  community,
  todayLabel,
}: {
  title: string;
  year: string;
  subject: string;
  cards: number;
  mastery?: number;
  community?: string;
  todayLabel?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative grid content-start gap-3 mt-4 p-5 rounded-lg border border-line bg-surface",
        "shadow-[0_-8px_0_-4px_var(--color-surface-2),0_-16px_0_-8px_var(--color-line)]",
      )}
    >
      <div className="flex flex-wrap gap-[6px]">
        <Tag>{year}</Tag>
        <Tag tone="brand">{subject}</Tag>
      </div>
      <h3 className="m-0 font-display font-semibold text-title-3 text-ink text-balance">
        {title}
      </h3>
      <div className="flex flex-wrap gap-x-3 gap-y-1 font-sans font-medium text-[13px] leading-[18px] text-ink-muted [&_svg]:size-[15px]">
        <span className="inline-flex items-center gap-1">
          <Layers aria-hidden strokeWidth={1.75} />
          {todayLabel ? `${cards} para hoje` : `${cards} cards`}
        </span>
      </div>
      {typeof mastery === "number" ? <ProgressBar value={mastery} /> : null}
      {community ? (
        <div className="flex items-center justify-between gap-3 mt-1">
          <span className="flex items-center gap-2 font-sans font-medium text-[13px] text-ink-muted">
            <Avatar name={community} size="xs" decorative />
            por <b className="text-ink font-semibold">{community}</b>
          </span>
          <span className="inline-flex items-center gap-2 h-control-sm px-4 rounded-sm bg-surface text-ink border border-line-strong font-sans font-semibold text-[14px] [&_svg]:size-[18px]">
            <Bookmark aria-hidden strokeWidth={1.75} /> Salvar
          </span>
        </div>
      ) : null}
    </div>
  );
}

function Plans() {
  return (
    <section
      id="planos"
      className="bg-surface border-y border-line"
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 md:py-24 flex flex-col items-center gap-8 md:gap-12">
        <div className="flex flex-col items-center gap-2 md:gap-3 text-center">
          <span className="font-sans font-semibold text-[13px] leading-[18px] text-primary">
            Planos
          </span>
          <h2 className="m-0 font-display font-bold text-[28px] md:text-display-lg leading-[34px] md:leading-[44px] tracking-[-0.01em] md:tracking-[-0.015em] text-ink">
            Um plano, duas formas de pagar
          </h2>
          <p className="m-0 font-sans text-body-lg text-ink-muted">
            Tudo liberado nos dois. Cancele quando quiser.
          </p>
        </div>
        <PlansGrid className="w-full max-w-[760px]">
          <PlanCard
            name="Pro mensal"
            priceLabel="R$ [preço]"
            periodLabel="/mês"
            status="available"
            highlights={[
              "Decks e cards ilimitados",
              "Importar PDF e Word",
              "Estatísticas e agenda de revisão",
              "Salvar decks da Comunidade",
            ]}
            action={
              <Link
                href="/criar-conta"
                className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md border border-line-strong bg-surface text-ink font-sans font-semibold text-[15px] no-underline hover:bg-surface-2 w-full"
              >
                Assinar mensal
              </Link>
            }
          />
          <PlanCard
            name="Pro anual"
            priceLabel="R$ [preço]"
            periodLabel="/ano"
            status="current"
            highlights={["Tudo do Pro mensal", "Menor preço por mês"]}
            action={
              <Link
                href="/criar-conta"
                className="inline-flex items-center justify-center gap-2 h-control px-5 rounded-md bg-primary text-on-primary font-sans font-semibold text-[15px] no-underline hover:bg-primary-hover w-full"
              >
                Assinar anual
              </Link>
            }
          />
        </PlansGrid>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 md:py-24">
      <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-8 md:p-16 flex flex-col md:flex-row flex-wrap items-start md:items-center md:justify-between gap-6 md:gap-8">
        <AuthFlair />
        <div className="relative flex flex-col gap-2 md:gap-3 max-w-[560px]">
          <h2 className="m-0 font-display font-bold text-[28px] md:text-display-lg leading-[34px] md:leading-[44px] tracking-[-0.01em] md:tracking-[-0.015em] text-balance">
            Seu próximo deck começa com um arquivo
          </h2>
          <p className="m-0 font-sans text-body-lg">
            Crie a conta, importe um resumo e faça a primeira revisão hoje.
          </p>
        </div>
        <Link
          href="/criar-conta"
          className="relative inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-md bg-surface text-ink border border-surface font-sans font-semibold text-[16px] no-underline hover:bg-surface-2"
        >
          Criar conta
          <Kbd>↵</Kbd>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-8 flex flex-wrap items-center gap-4 md:gap-6 font-sans text-[14px] leading-5 text-ink-muted">
        <Wordmark size="sm" />
        <span>Flashcards que conectam o que você estuda.</span>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-5 md:ml-auto">
          <a href="#termos" className="text-ink-muted hover:text-ink no-underline">
            Termos de uso
          </a>
          <a href="#privacidade" className="text-ink-muted hover:text-ink no-underline">
            Privacidade
          </a>
          <a href="#contato" className="text-ink-muted hover:text-ink no-underline">
            Contato
          </a>
        </nav>
        <span>© 2026 Sinapse</span>
      </div>
    </footer>
  );
}
