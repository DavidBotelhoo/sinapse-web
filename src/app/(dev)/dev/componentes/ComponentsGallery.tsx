"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Bookmark,
  Clock,
  Crown,
  Flame,
  ListChecks,
  LogOut,
  Mail,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import {
  Avatar,
  Button,
  Chip,
  Chips,
  CompactThemeToggle,
  DeckCard,
  DecksGrid,
  EditableAvatar,
  EmptyState,
  FieldRow,
  FileDrop,
  FilterBar,
  Flashcard,
  Form,
  Kbd,
  NewDeckCard,
  PasswordField,
  PlanCard,
  PlansGrid,
  ProgressBar,
  RatingButtons,
  SegmentedTabs,
  SessionBar,
  SessionSummary,
  Spark,
  StatCard,
  StatsGrid,
  Tag,
  TextField,
  ThemeToggle,
  WeekStrip,
  type FileDropState,
} from "@/components/ui";

export function ComponentsGallery() {
  return (
    <main className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4 bg-bg/90 backdrop-blur border-b border-line">
        <div>
          <h1 className="m-0 font-display font-bold text-title-2 text-ink">
            Componentes do Sinapse
          </h1>
          <p className="m-0 font-sans text-[13px] leading-[18px] text-ink-muted">
            Página interna; indisponível em produção. Compare com{" "}
            <code className="font-mono text-[12px]">docs/design-system/galeria.html</code>.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <div className="mx-auto max-w-content px-6 py-10 grid gap-14">
        <ButtonsSection />
        <TextFieldSection />
        <TagSection />
        <ChipSection />
        <AvatarSection />
        <ThemeToggleSection />
        <SegmentedTabsSection />
        <FilterBarSection />
        <StatCardSection />
        <DeckCardSection />
        <EmptyStateSection />
        <FileDropSection />
        <FlashcardSection />
        <RatingButtonsSection />
        <SessionSummarySection />
        <PlanCardSection />
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="grid gap-5">
      <div>
        <h2 className="m-0 font-display font-bold text-title-1 text-ink">{title}</h2>
        {subtitle ? (
          <p className="m-0 mt-1 font-sans text-body text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid gap-6 p-6 rounded-lg border border-line bg-surface">{children}</div>
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function ButtonsSection() {
  return (
    <Section id="button" title="Button" subtitle="Primário, secundário, fantasma, destaque e perigo.">
      <Row>
        <Button variant="primary">Criar conta</Button>
        <Button variant="secondary">Entrar</Button>
        <Button variant="ghost" iconRight={<ArrowRight strokeWidth={1.75} className="size-[18px]" />}>
          Ver todos
        </Button>
        <Button variant="accent" iconLeft={<Crown strokeWidth={1.75} className="size-[18px]" />}>
          Assinar o Pro
        </Button>
        <Button variant="danger" iconLeft={<LogOut strokeWidth={1.75} className="size-[18px]" />}>
          Sair da conta
        </Button>
      </Row>
      <Row>
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<Bookmark strokeWidth={1.75} className="size-[18px]" />}
        >
          Salvar deck
        </Button>
        <Button variant="primary" size="sm">
          Revisar
        </Button>
        <Button variant="secondary" iconOnly aria-label="Filtros">
          <SlidersHorizontal strokeWidth={1.75} className="size-[18px]" />
        </Button>
        <Button variant="primary" loading loadingText="Lendo arquivo…">
          Importar
        </Button>
      </Row>
      <div className="max-w-[360px]">
        <Button variant="primary" size="lg" block>
          Mostrar resposta <Kbd>Espaço</Kbd>
        </Button>
      </div>
      <div className="p-6 rounded-lg bg-primary">
        <Button variant="onPrimary">Cancelar</Button>
      </div>
    </Section>
  );
}

function TextFieldSection() {
  const [name, setName] = useState("Ana");
  return (
    <Section id="textfield" title="TextField" subtitle="Rótulo, dica, erro, senha com toggle e dois lado a lado.">
      <Form className="max-w-[420px]">
        <FieldRow>
          <TextField
            label="Nome"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField label="Sobrenome" autoComplete="family-name" defaultValue="Souza" />
        </FieldRow>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          leftIcon={<Mail strokeWidth={1.75} />}
          placeholder="voce@faculdade.edu.br"
        />
        <PasswordField
          label="Senha"
          autoComplete="new-password"
          hint="Mínimo de 8 caracteres."
          defaultValue="123"
        />
        <TextField
          label="Email"
          error="Confira o email: falta o final, como .com"
          defaultValue="ana@faculdade"
        />
        <TextField
          label="Senha atual"
          action={
            <a href="#" className="text-primary underline underline-offset-4">
              Esqueci minha senha
            </a>
          }
        />
      </Form>
    </Section>
  );
}

function TagSection() {
  return (
    <Section id="tag" title="Tag" subtitle="Ano, matéria, visibilidade e selo de plano.">
      <Row>
        <Tag>2º ano</Tag>
        <Tag tone="brand">Farmacologia</Tag>
        <Tag tone="accent" icon={<Crown strokeWidth={1.75} />}>
          Seu plano
        </Tag>
        <Tag tone="outline">Privado</Tag>
      </Row>
    </Section>
  );
}

function ChipSection() {
  const [year, setYear] = useState("2");
  const [subjects, setSubjects] = useState<string[]>(["farmacologia", "fisiologia"]);
  return (
    <Section id="chip" title="Chip" subtitle="Escolha única (radio), múltipla e removível.">
      <div className="grid gap-3">
        <span className="font-sans font-semibold text-[13px] text-ink">Ano do curso</span>
        <Chips group="radio" label="Ano do curso">
          {["1", "2", "3", "4", "5", "6"].map((v) => (
            <Chip key={v} role="radio" selected={year === v} onClick={() => setYear(v)}>
              {v}º ano
            </Chip>
          ))}
        </Chips>
      </div>
      <div className="grid gap-3">
        <span className="font-sans font-semibold text-[13px] text-ink">Matérias</span>
        <Chips group="checkbox" label="Matérias">
          {[
            ["farmacologia", "Farmacologia"],
            ["fisiologia", "Fisiologia"],
            ["anatomia", "Anatomia"],
            ["bioquimica", "Bioquímica"],
          ].map(([v, label]) => {
            const selected = subjects.includes(v!);
            return (
              <Chip
                key={v}
                selected={selected}
                onClick={() =>
                  setSubjects((prev) =>
                    prev.includes(v!) ? prev.filter((x) => x !== v) : [...prev, v!],
                  )
                }
              >
                {label}
              </Chip>
            );
          })}
        </Chips>
      </div>
    </Section>
  );
}

function AvatarSection() {
  const [photo, setPhoto] = useState<string | null>(null);
  return (
    <Section id="avatar" title="Avatar" subtitle="Iniciais, foto, cinco tamanhos e a versão editável.">
      <Row>
        <Avatar name="Ana Souza" size="xs" />
        <Avatar name="Ana Souza" size="sm" />
        <Avatar name="Ana Souza" />
        <Avatar name="Ana Souza" size="lg" />
        <Avatar name="Ana Souza" size="xl" />
      </Row>
      <EditableAvatar
        name="Ana Souza"
        src={photo ?? undefined}
        onPick={(file) => setPhoto(URL.createObjectURL(file))}
        onRemove={() => setPhoto(null)}
      />
    </Section>
  );
}

function ThemeToggleSection() {
  return (
    <Section id="theme" title="ThemeToggle" subtitle="Padrão no rodapé da sidebar; compacto no Perfil do celular.">
      <ThemeToggle />
      <CompactThemeToggle />
    </Section>
  );
}

function SegmentedTabsSection() {
  const [tab, setTab] = useState<"todos" | "meus" | "comunidade" | "favoritos">("todos");
  const [vis, setVis] = useState<"privado" | "publico">("privado");
  return (
    <Section id="tabs" title="SegmentedTabs" subtitle="Abas com contagem (tabs) e seletor em bloco (radiogroup).">
      <SegmentedTabs
        ariaLabel="Filtrar flashcards"
        value={tab}
        onChange={setTab}
        items={[
          { value: "todos", label: "Todos", count: 128 },
          { value: "meus", label: "Meus", count: 24 },
          { value: "comunidade", label: "Da comunidade", count: 96 },
          { value: "favoritos", label: "Favoritos", count: 8 },
        ]}
      />
      <div className="max-w-[360px]">
        <SegmentedTabs
          as="radio"
          variant="block"
          ariaLabel="Visibilidade"
          value={vis}
          onChange={setVis}
          items={[
            { value: "privado", label: "Privado" },
            { value: "publico", label: "Público" },
          ]}
        />
      </div>
    </Section>
  );
}

function FilterBarSection() {
  const [year, setYear] = useState<ReadonlyArray<string>>(["2"]);
  const [subjects, setSubjects] = useState<ReadonlyArray<string>>(["farmacologia", "fisiologia"]);
  return (
    <Section id="filterbar" title="FilterBar" subtitle="Dois filtros independentes com popover.">
      <FilterBar
        onClearAll={() => {
          setYear([]);
          setSubjects([]);
        }}
        filters={[
          {
            id: "ano",
            label: "Ano do curso",
            variant: "chips",
            singleValueLabel: (v) => `${v}º ano`,
            options: ["1", "2", "3", "4", "5", "6"].map((v) => ({ value: v, label: `${v}º ano` })),
            selected: year,
            onChange: setYear,
          },
          {
            id: "materia",
            label: "Matéria",
            variant: "search",
            options: [
              { value: "farmacologia", label: "Farmacologia" },
              { value: "fisiologia", label: "Fisiologia" },
              { value: "anatomia", label: "Anatomia" },
              { value: "bioquimica", label: "Bioquímica" },
              { value: "patologia", label: "Patologia" },
              { value: "microbiologia", label: "Microbiologia" },
            ],
            selected: subjects,
            onChange: setSubjects,
          },
        ]}
      />
    </Section>
  );
}

function StatCardSection() {
  return (
    <Section id="statcard" title="StatCard" subtitle="Streak, Cards estudados, Horas, Taxa de acerto.">
      <StatsGrid>
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
                { letter: "S", done: true, today: true },
                { letter: "S" },
                { letter: "D" },
              ]}
            />
          }
        />
        <StatCard
          icon={<ListChecks />}
          label="Cards estudados"
          value={184}
          unit="esta semana"
          trend={{ direction: "up", label: "+22% vs. semana anterior" }}
        />
        <StatCard
          icon={<Clock />}
          label="Horas estudadas"
          value="6h40"
          unit="min"
          footer={
            <Spark
              bars={[
                { height: 30 },
                { height: 40 },
                { height: 55 },
                { height: 70 },
                { height: 90, today: true },
                { height: 20 },
                { height: 10 },
              ]}
            />
          }
        />
        <StatCard
          icon={<Target />}
          label="Taxa de acerto"
          value="78%"
          footer={
            <>
              <ProgressBar value={78} label="Taxa de acerto" />
              <p className="mt-2 font-sans font-medium text-[12px] leading-4 text-ink-muted">
                (Fácil + Difícil) ÷ total nos últimos 7 dias
              </p>
            </>
          }
        />
      </StatsGrid>
    </Section>
  );
}

function DeckCardSection() {
  const [fav, setFav] = useState(true);
  return (
    <Section id="deckcard" title="DeckCard" subtitle="Meu deck, da comunidade e o card de criar novo.">
      <DecksGrid>
        <DeckCard
          href="#"
          title="Farmacologia do sistema nervoso autônomo"
          year="2º ano"
          subjects={["Farmacologia"]}
          cardsCount={84}
          due={{ kind: "updated", relative: "há 2 dias" }}
          masteryPct={62}
          ownership={{ kind: "mine", visibility: "private" }}
        />
        <DeckCard
          href="#"
          title="Fisiologia renal — filtração glomerular"
          year="2º ano"
          subjects={["Fisiologia"]}
          cardsCount={52}
          due={{ kind: "today", count: 15 }}
          masteryPct={40}
          ownership={{ kind: "community", firstName: "Marina" }}
          favorite={fav}
          onToggleFavorite={() => setFav((v) => !v)}
        />
        <NewDeckCard href="#" />
      </DecksGrid>
    </Section>
  );
}

function EmptyStateSection() {
  return (
    <Section id="emptystate" title="EmptyState" subtitle="Três cartas em leque, título convite e botão.">
      <EmptyState
        title="Monte seu primeiro deck para começar a estudar"
        body="Você ainda não tem flashcards salvos. Importe um PDF ou Word, ou salve um deck pronto da Comunidade."
        primaryAction={<Button variant="primary">Ir para Flashcards</Button>}
        secondaryAction={<Button variant="secondary">Explorar a Comunidade</Button>}
      />
    </Section>
  );
}

function FileDropSection() {
  const [state, setState] = useState<FileDropState>({ kind: "idle" });
  return (
    <Section id="filedrop" title="FileDrop" subtitle="Repouso, lendo (64%), pronto e com aviso.">
      <FileDrop
        state={state}
        onFile={(file) =>
          setState({ kind: "readOk", file, summary: "48 perguntas com resposta encontradas" })
        }
        onCancel={() => setState({ kind: "idle" })}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setState({ kind: "idle" })}
        >
          Repouso
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setState({
              kind: "reading",
              file: fakeFile("Farmacologia_SNA.pdf"),
              progress: 64,
            })
          }
        >
          Lendo
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setState({
              kind: "readOk",
              file: fakeFile("Farmacologia_SNA.pdf"),
              summary: "48 perguntas com resposta encontradas",
            })
          }
        >
          Pronto
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setState({
              kind: "readWarn",
              file: fakeFile("Fisiologia_renal.docx"),
              summary: "46 prontas · 2 perguntas sem resposta",
            })
          }
        >
          Aviso
        </Button>
      </div>
    </Section>
  );
}

function fakeFile(name: string): File {
  return new File([""], name, { type: "application/pdf" });
}

function FlashcardSection() {
  const [flipped, setFlipped] = useState(false);
  return (
    <Section id="flashcard" title="Flashcard" subtitle="Clique, Espaço ou Enter viram; motion-reduce vira fade.">
      <div className="grid gap-5 w-full max-w-[640px] mx-auto">
        <SessionBar position="3 / 20" progress={15} timeLabel="04:12" onExit={() => undefined} />
        <Flashcard
          subject="Farmacologia"
          year="2º ano"
          flipped={flipped}
          onFlip={() => setFlipped((v) => !v)}
          question="Qual o principal mecanismo de ação da metformina?"
          answer="Reduz a produção hepática de glicose por ativação da AMPK, aumentando a sensibilidade à insulina sem causar hipoglicemia."
          longAnswer
        />
        {!flipped ? (
          <Button variant="primary" size="lg" block onClick={() => setFlipped(true)}>
            Mostrar resposta <Kbd>Espaço</Kbd>
          </Button>
        ) : (
          <RatingButtons
            onRate={() => setFlipped(false)}
            intervals={{ again: "1 min", hard: "10 min", easy: "4 dias" }}
            keyboardEnabled={false}
          />
        )}
      </div>
    </Section>
  );
}

function RatingButtonsSection() {
  return (
    <Section id="rating" title="RatingButtons" subtitle="Errei · Difícil · Fácil (teclas 1, 2, 3 quando ligadas).">
      <div className="max-w-[640px]">
        <RatingButtons
          onRate={() => undefined}
          intervals={{ again: "1 min", hard: "10 min", easy: "4 dias" }}
          keyboardEnabled={false}
        />
      </div>
    </Section>
  );
}

function SessionSummarySection() {
  return (
    <Section id="summary" title="SessionSummary" subtitle="Anel de taxa de acerto, divisão e fatos.">
      <SessionSummary
        hitRate={78}
        counts={{ again: 3, hard: 5, easy: 12 }}
        subtitle="20 cards em 14 minutos."
        totalTime="14 min"
        avgPerCard="42s"
        streak={{ days: 13, increased: true }}
        primaryAction={<Button variant="primary">Estudar novamente</Button>}
        secondaryAction={<Button variant="secondary">Escolher novos temas</Button>}
      />
    </Section>
  );
}

function PlanCardSection() {
  return (
    <Section id="plancard" title="PlanCard" subtitle="Plano atual, outro plano e pagamento recusado.">
      <PlansGrid>
        <PlanCard
          name="Pro mensal"
          priceLabel="R$ [preço]"
          periodLabel="/mês"
          status="current"
          highlights={[
            "Decks e cards ilimitados",
            "Importar PDF e Word",
            "Revisão espaçada com agenda",
            "Decks da Comunidade",
            "Estatísticas de estudo",
          ]}
          statusLine="Renova em 15 dez 2026 · cartão final 4417"
          action={<Button variant="secondary" block>Gerenciar assinatura</Button>}
        />
        <PlanCard
          name="Pro anual"
          priceLabel="R$ [preço]"
          periodLabel="/ano"
          note="2 meses grátis · equivale a R$ [preço]/mês"
          status="available"
          highlights={[
            "Decks e cards ilimitados",
            "Importar PDF e Word",
            "Revisão espaçada com agenda",
            "Decks da Comunidade",
            "Estatísticas de estudo",
          ]}
          action={<Button variant="primary" block>Mudar para o anual</Button>}
        />
        <PlanCard
          name="Pro mensal"
          priceLabel="R$ [preço]"
          periodLabel="/mês"
          status="declined"
          highlights={["Decks e cards ilimitados", "Importar PDF e Word"]}
          warningLine="Atualize o cartão até 20 nov para não perder o acesso."
          action={<Button variant="primary" block>Atualizar cartão</Button>}
        />
      </PlansGrid>
    </Section>
  );
}
