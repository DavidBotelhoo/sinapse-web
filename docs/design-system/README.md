Sinapse é um app de flashcards por assinatura para estudantes, começando por Medicina e pensado para crescer para outros cursos. O nome vem de onde a memória se forma: cada revisão fortalece uma conexão. A identidade tem dois turnos — **Plantão** (tema claro: petróleo e coral sobre papel quente) e **Madrugada** (tema escuro: petróleo profundo, lima e coral) — com os mesmos tokens trocando de valor. Este documento é a regra para quem desenha ou programa qualquer tela do Sinapse.

## Voz e texto

Fale como um colega de turma que estuda junto: direto, encorajador, sem infantilizar e sem papo de marketing.

- Trate por **você**, em português do Brasil. Frases curtas. Nada de "por favor", "simplesmente" ou "fácil".
- Botões e links: verbo no infinitivo, só a primeira letra maiúscula. "Criar conta", "Entrar", "Mostrar resposta", "Estudar novamente", "Escolher novos temas", "Salvar", "Ver todos".
- Títulos sem ponto final; textos de apoio com ponto final.
- Sem exclamação no dia a dia. Conquistas ganham um reconhecimento curto: "13 dias seguidos. Mantenha o ritmo."
- Sem emoji na interface. A chama do streak é o ícone `flame`.
- Números no padrão brasileiro: 1.284 cards, 78%, R$ 24,90, 6h40min, "15 nov", "2º ano".
- Erros dizem o que houve e o que fazer: "Esse email já tem conta. Entre ou recupere a senha." Login errado não revela o campo: "Email ou senha não conferem."
- Estados vazios são convites com o próximo passo: "Monte seu primeiro deck para começar a estudar".

Vocabulário fixo:

| Use | Evite |
| --- | --- |
| deck, card (ou flashcard) | baralho, cartão, ficha |
| Streak (no card); "dias seguidos" no texto | ofensiva, combo |
| Comunidade, deck público, salvar | marketplace, clonar, baixar |
| matéria, ano do curso ("2º ano") | disciplina, período, semestre |
| Errei · Difícil · Fácil | Again · Hard · Easy, "Não sei" |

Na Comunidade, o dono do deck aparece só pelo **primeiro nome** ("por Marina").

## Cor

Os nomes de token são semânticos; o tema (`data-theme="light"` ou `"dark"` no `<html>`) troca os valores.

| Papel | Tokens | Claro · Plantão | Escuro · Madrugada |
| --- | --- | --- | --- |
| Fundos | `bg`, `surface`, `surface-2` | papel quente, branco, areia | petróleo profundo, um e dois tons acima |
| Linhas | `line` (decorativa), `line-strong` (controles, 3:1) | areia, taupe | petróleo claro, cinza-esverdeado |
| Texto | `ink`, `ink-muted`, `ink-faint` | verde quase preto | gelo |
| Marca | `primary`, `primary-hover`, `on-primary`, `primary-soft`, `on-primary-soft` | petróleo | lima |
| Energia | `accent`, `on-accent`, `accent-soft`, `on-accent-soft`, `accent-ink` | coral | coral claro |
| Avaliação | `again*`, `hard*`, `easy*` (cada um com `-soft` e `on-…-soft`) | tijolo, mostarda, petróleo claro | salmão, amarelo, lima |
| Status | `success`, `danger`, `warning` e seus `-soft` | verde, vermelho, âmbar escuros | os mesmos, claros |
| Foco e véu | `focus`, `scrim` | petróleo; véu esverdeado | lima; véu preto |

Regras:

- **Um** botão `primary` por tela. Ele é a ação para a qual a tela existe.
- `accent` é de conquista e de atraso: streak, selo "Seu plano", "Assinar o Pro" e o que já devia ter sido revisado ("5 atrasados", "Atrasado", "Para rever"). Não use para ações comuns nem para erro.
- `again`, `hard`, `easy` só existem no estudo e no resumo da sessão.
- Texto sobre um preenchimento usa o `on-…` do par. Nunca branco fixo: no escuro o `primary` é lima e pede tinta escura (`on-primary`).
- Todo texto tem pelo menos 4.5:1 sobre os fundos citados na nota do token, nos dois temas; bordas de controles, ícones com significado e anel de foco, 3:1. O coral do tema claro é só preenchimento (2.8:1 sobre branco): para ícone ou texto coral, `accent-ink`.
- A cor nunca é a única pista: Errei/Difícil/Fácil têm palavra e ícone; chips ligados mostram um check.

## Tipografia

Duas famílias, ambas no Google Fonts (o `@import` está no início de `components/bundle.css`):

- **Bricolage Grotesque** (`display`): títulos, números grandes, pergunta e resposta do flashcard, o nome Sinapse.
- **Figtree** (`sans`): toda a interface e o texto corrido.

| Estilo | Tamanho | Onde |
| --- | --- | --- |
| `display-xl` / `display-lg` | 56 / 40 | Landing; título do login e cadastro |
| `title-1` | 28 | "Olá, Ana", título de página, "Sessão concluída" |
| `title-2` / `title-3` | 22 / 18 | Blocos da página; nome do deck e do plano |
| `card-question` | 24 | Pergunta e resposta do flashcard (acima de ~110 caracteres, `body-lg`) |
| `stat-value` | 32 | Números dos cards de estatística e do resumo |
| `body-lg` / `body` / `body-strong` | 17 / 15 / 15 | Texto |
| `label` / `caption` | 13 / 12 | Rótulos, tags, metadados, legenda da barra inferior |

Números de estatística e contadores usam algarismos tabulares (`font-variant-numeric: tabular-nums`, classe `sn-num`). No máximo três tamanhos de texto por card.

## Espaço, forma e profundidade

- Grade de 4px: `space-1` (4) a `space-16` (64). Margem lateral das páginas: `space-8` no desktop, `space-4`–`space-6` no celular.
- Raios: `radius-sm` (tags, barras), `radius-md` (botões, campos, abas), `radius-lg` (cards), `radius-xl` (o flashcard, login e cadastro, modais), `radius-full` (play, avatar, chips).
- Cards em repouso têm borda `line` e nenhuma sombra. Sombra é para o que flutua ou se destaca: `shadow-sm` (aba selecionada), `shadow-md` (flashcard, popover, hover de deck), `shadow-lg` (modais, login), `shadow-play` (só o play da barra inferior).
- **O maço** é a forma da marca: o card de deck mostra duas cartas atrás dele, o estado vazio mostra três cartas em leque e a capa empilha blocos como um deck. Não troque por borda colorida lateral.
- Tamanhos: `size-control` 44px (alvo mínimo de toque), `size-control-sm` 36px, `size-play` 60px, `size-bottom-nav` 72px, `size-sidebar` 248px, `size-content` 1120px.

## Layout e telas

| Largura | Navegação |
| --- | --- |
| ≥ 1024px | Sidebar de 248px: Início, Estudar, Flashcards, Comunidade; no rodapé, tema e perfil |
| 768–1023px | Sidebar compacta de 80px, só ícones |
| < 768px | BottomNav: Início, Flashcards, **Estudar** (play em destaque), Comunidade, Perfil |

Telas:

- **Landing:** topo com o nome, "Entrar" (secundário) e "Criar conta" (primário). Hero em `display-xl` com uma frase do que o app faz e o mesmo "Criar conta". Depois: como funciona (importe → estude → revise na hora certa), para quem (Medicina, hoje), planos e um último "Criar conta".
- **Entrar / Criar conta:** [AuthPanel](components/AuthPanel/README.md). Login à direita, cadastro à esquerda no desktop, com o painel colorido deslizando; no celular, o card vira.
- **Início:** "Olá, [primeiro nome]" em `title-1`; os quatro [StatCard](components/StatCard/README.md) (Streak, Cards estudados, Horas estudadas na semana, Taxa de acerto); "Últimos decks estudados" com os 4 mais recentes e "Ver todos"; o card "Criar novo deck"; a [Agenda de revisão](components/ReviewAgenda/README.md). No desktop, estatísticas em linha e abaixo duas colunas (decks 2/3, agenda 1/3).
- **Estudar:** escolha de decks ou matérias e "Começar". A sessão é [Flashcard](components/Flashcard/README.md) + [RatingButtons](components/RatingButtons/README.md), com a navegação escondida. No fim, [SessionSummary](components/SessionSummary/README.md). Sem flashcards salvos: [EmptyState](components/EmptyState/README.md) com "Ir para Flashcards".
- **Flashcards:** [SegmentedTabs](components/SegmentedTabs/README.md) Todos (padrão) · Meus · Da comunidade · Favoritos, [FilterBar](components/FilterBar/README.md) por ano e matéria, botão "Criar deck" e a grade de [DeckCard](components/DeckCard/README.md). Criar deck usa o [FileDrop](components/FileDrop/README.md): arquivo, nome, ano, matérias e visibilidade.
- **Comunidade:** FilterBar e a grade de decks públicos com nome, ano, matérias, primeiro nome do dono e "Salvar".
- **Perfil:** [Avatar](components/Avatar/README.md) editável, nome e sobrenome editáveis, email, "Trocar senha", tema (no celular), Assinatura ([PlanCard](components/PlanCard/README.md)) e "Sair da conta" por último.

## Movimento

As durações e curvas ficam em `components/bundle.css`:

| Token CSS | Valor | Uso |
| --- | --- | --- |
| `--dur-fast` | 120ms | Hover, pressionar |
| `--dur-base` | 220ms | Abas, seletor de tema, fades |
| `--dur-slow` | 420ms | Virar o flashcard |
| `--dur-auth` | 680ms | Login ↔ cadastro (deslize no desktop, giro no celular) |
| `--ease-out` | — | Padrão |
| `--ease-in-out` | — | Painel deslizante e giro do card de login |
| `--ease-spring` | — | Retorno ao soltar: play, botões de avaliação |

Com `prefers-reduced-motion`, as durações vão a ~0 e o flashcard troca por fade. Sem confete nem animação de comemoração: a conquista é o número e a cor de destaque.

## Estados e foco

- Foco do teclado: contorno sólido de 2px em `focus`, afastado 2px, em tudo que é clicável. Campos mostram foco com borda `primary` e halo `primary-soft`.
- Hover: `surface-2` (secundários, linhas, itens de menu) ou `primary-hover` (primários). Pressionar encolhe para 98%.
- Carregando: `aria-busy="true"` e o ícone `loader-circle` girando, com o texto no gerúndio.
- Evite botões desabilitados: deixe ativos e explique o problema no campo.

## Iconografia

[Lucide](https://lucide.dev) 0.460.0, contorno, traço 1.75, 20px na interface (16 em chips, 14 em tags, 26 no play). Em React, `lucide-react`; em Angular, `lucide-angular`. O play e a estrela de favorito marcada são preenchidos (`fill: currentColor`); o resto é contorno. Os previews carregam `components/lib/lucide.min.js`.

| Onde | Ícone |
| --- | --- |
| Início · Estudar · Flashcards · Comunidade · Perfil | `house` · `play` · `layers` · `users` · `user` |
| Streak · Cards estudados · Horas · Taxa de acerto | `flame` · `list-checks` · `clock` · `target` |
| Errei · Difícil · Fácil | `x` · `minus` · `check` |
| Favoritar · Salvar / salvo | `star` · `bookmark` / `bookmark-check` |
| Público · Privado | `globe` · `lock` |
| Importar · Filtros · Buscar | `cloud-upload` · `sliders-horizontal` · `search` |
| Tema claro · escuro · Configurações · Sair | `sun` · `moon` · `settings` · `log-out` |
| Assinatura · Estudar novamente | `crown` · `rotate-ccw` |

## Marca

Ainda não existe logo. Use o nome em texto com `sn-wordmark`: "Sinapse" em Bricolage Grotesque 800, `ink` (ou `on-primary` sobre o painel colorido), seguido de um ponto em `accent` — o "nó" da sinapse. Não desenhe um símbolo provisório. Escreva sempre "Sinapse", com S maiúsculo.

## No código

1. Carregue `tokens.css` e depois `components/bundle.css` (que já importa as fontes).
2. Coloque `data-theme="light"` ou `"dark"` no `<html>`; na primeira visita, siga `prefers-color-scheme`.
3. Use as classes `sn-*` de cada componente, com a marcação do guia dele.

Em Next.js: importe os dois CSS no `app/layout.tsx`, defina `<html lang="pt-BR" data-theme={tema}>` e aplique o tema salvo num script inline do `<head>` (ou `next-themes` com `attribute="data-theme"`) para a tela não piscar.
