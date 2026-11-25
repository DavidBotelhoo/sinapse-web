# Sinapse — front (sinapse-web)

App web do Sinapse, um app de flashcards por assinatura para estudantes (começando por Medicina). Este repositório tem a landing page e o app. A API fica em outro repositório (`sinapse-api`, NestJS); o contrato entre os dois é o OpenAPI da API.

Antes de qualquer tarefa, leia:

1. `docs/produto.md`: o que o app faz, tela por tela, e as decisões em aberto.
2. `docs/telas/README.md`: as telas aprovadas, cada estado em PNG, SVG e HTML, nos dois temas, no desktop e no celular. É a referência visual de cada rota.
3. `docs/design-system/README.md`: o guia da marca (voz, cores, tipografia, telas, movimento, ícones).
4. Ao construir ou alterar um componente: `docs/design-system/components/<Componente>/README.md`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** em modo `strict`. Node 24 LTS (mínimo 20.9).
- **Tailwind CSS v4**, configurado só em CSS (sem `tailwind.config.*`). O tema está em `src/styles/sinapse-theme.css`.
- **Fontes:** `next/font/google` com `Bricolage_Grotesque` (variável `--font-bricolage`) e `Figtree` (variável `--font-figtree`).
- **Ícones:** `lucide-react`, com `strokeWidth={1.75}` e `size={20}` por padrão.
- **API:** tipos gerados com `openapi-typescript` a partir de `${API_URL}/docs-json`, chamados com `openapi-fetch`. Nunca escreva à mão os tipos de resposta da API.
- **Dados no cliente:** TanStack Query. Telas que podem renderizar no servidor buscam no servidor (Server Components).
- **Formulários:** `react-hook-form` + `zod`.
- **Tema claro/escuro:** `next-themes` com `attribute="data-theme"` e `defaultTheme="system"`. A landing e as telas de conta (`/entrar`, `/criar-conta`, `/redefinir-senha`) ficam sempre no claro (`forcedTheme` em `src/components/ThemeProvider.tsx`); dentro do app vale a escolha da pessoa.
- **Gerenciador de pacotes:** pnpm.

## Estrutura

```
src/
  app/
    (marketing)/page.tsx              landing  →  /
    (auth)/entrar/page.tsx            /entrar
    (auth)/criar-conta/page.tsx       /criar-conta
    (auth)/redefinir-senha/page.tsx
    (app)/layout.tsx                  sidebar (desktop) + barra inferior (celular)
    (app)/inicio/page.tsx
    (app)/estudar/page.tsx            escolha: por tema ou por deck, quantidade e ordem
    (app)/flashcards/page.tsx         abas Todos | Meus | Da comunidade | Favoritos
    (app)/flashcards/novo/page.tsx    importar PDF/Word e criar deck (no celular, sem barra inferior)
    (app)/flashcards/[deckId]/page.tsx  detalhe do deck: meu ou salvo da comunidade
    (app)/comunidade/page.tsx
    (app)/comunidade/[deckId]/page.tsx  prévia de um deck público antes de salvar
    (app)/perfil/page.tsx             aba Conta
    (app)/perfil/assinatura/page.tsx  aba Assinatura
    (foco)/layout.tsx                 sem sidebar nem barra inferior; protegido como o (app)
    (foco)/estudar/sessao/[id]/page.tsx  pergunta → resposta → avaliação → resumo
    layout.tsx  globals.css
  components/
    ui/          os componentes do design system (Button, TextField, Tag, Chip, Avatar, SegmentedTabs, ...)
    <feature>/   peças de cada área (study/, decks/, home/, auth/, billing/)
  lib/
    api/         schema.d.ts gerado, client.ts (openapi-fetch), queries/
    utils/
  styles/
    sinapse-theme.css
proxy.ts         proteção das rotas do grupo (app); no Next 16 substitui o middleware.ts
```

Rotas em português, como acima.

## Design system: regras

O design system é a fonte da verdade visual. `docs/design-system/` traz `tokens.json`, o guia, o guia de cada componente e `components/bundle.css`, que tem os valores exatos de cada componente escritos em CSS puro com classes `sn-*`. Para ver tudo funcionando, abra `docs/design-system/galeria.html` no navegador; ela tem um seletor de tema.

**Não importe `bundle.css` no app.** Recrie cada componente como componente React com classes do Tailwind, copiando medidas, cores e comportamento do `bundle.css` e do preview correspondente. O resultado precisa ficar igual ao preview nos dois temas.

Setup do tema:

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "../styles/sinapse-theme.css";
```

`src/styles/sinapse-theme.css` é cópia de `docs/design-system/tailwind/sinapse-theme.css`, que é gerado a partir de `tokens.json`. Não edite os valores à mão.

### De token para classe

| Token | Classe Tailwind |
| --- | --- |
| cor `primary`, `on-primary`, `surface`, `ink-muted`, `again-soft`… | `bg-primary`, `text-on-primary`, `bg-surface`, `text-ink-muted`, `bg-again-soft`, `border-line`, `outline-focus` |
| `space-N` (4px × N) | `p-N`, `m-N`, `gap-N` (a escala padrão do Tailwind já é 4px) |
| `radius-sm/md/lg/xl/full` | `rounded-sm/md/lg/xl/full` (8/12/16/24/pílula) |
| `shadow-sm/md/lg/play` | `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-play` |
| `size-control`, `size-control-sm`, `size-play`, `size-bottom-nav`, `size-sidebar` | `h-control`, `h-control-sm`, `size-play`, `h-bottom-nav`, `w-sidebar` |
| `size-content` | `max-w-content` |
| estilos de texto (`title-1`, `body`, `label`, `card-question`, `stat-value`…) | `text-title-1`, `text-body`, `text-label`… (já trazem altura de linha, peso e espaçamento) |
| família `display` / `sans` | `font-display` / `font-sans` |
| movimento | `duration-(--dur-fast/base/slow/auth)`, `ease-out`, `ease-in-out`, `ease-spring` |

### Regras que não se quebram

- **Só tokens.** Nada de hex, `rgb()` nem cores arbitrárias (`bg-[#...]`). A paleta padrão do Tailwind está desligada de propósito.
- O tema muda por `data-theme` no `<html>`; os tokens trocam sozinhos. Use `dark:` só em último caso.
- Texto sobre preenchimento colorido usa o `on-…` do par (`bg-primary text-on-primary`). Nunca `text-white`: no escuro o primary é lima e pede texto escuro.
- **Um** botão primário por tela.
- `accent` (coral) só para streak, conquistas, assinatura e cards atrasados. As cores `again`, `hard` e `easy` só existem na sessão de estudo e no resumo dela.
- Foco visível em tudo que é clicável (já está no CSS base); campos usam `focus-within:border-primary` com halo `ring-3 ring-primary-soft`.
- Movimento reduzido: o 3D do flashcard e do login vira fade com `motion-reduce:`.
- Alvos de toque de no mínimo 44px (`h-control`).
- Números de estatística com `tabular-nums`.

### Componentes críticos

- **AuthPanel** (`/entrar` e `/criar-conta`): no desktop, login à direita e cadastro à esquerda, com o painel `bg-primary` deslizando em `--dur-auth`. No celular, um card que gira em Y (as duas faces com `backface-hidden`). O modo segue a largura do próprio componente (`@container`, ponto de troca em 720px). O formulário escondido recebe `inert`. Veja `components/AuthPanel/README.md`.
- **Flashcard + RatingButtons:** virar com clique, Espaço ou Enter; avaliar com 1, 2, 3; avaliar já avança. Veja os READMEs.
- **BottomNav:** o play (`size-play`) sobe 26px acima da barra, com anel na cor `bg` e `shadow-play`.

## Telas

`docs/telas/` é a referência de como cada tela tem que ficar. O `README.md` de lá lista cada tela e estado, com a rota e os arquivos. Para cada uma:

- **PNG** (2×): a referência de pixel. Compare o que você construiu com ela nos dois temas.
- **SVG:** a mesma tela em vetor, para medir e ampliar. O texto vem em contornos, então copie os textos do HTML.
- **HTML** (`html/`): a tela estática com a estrutura e as classes exatas. Abra no navegador para inspecionar medidas e espaçamentos. Usa `docs/design-system/tokens.css`, `components/bundle.css` e as fontes locais; troque o tema mudando `data-theme` no primeiro `div` dentro de `#root`.
- **Fonte** (`fonte/`): o arquivo da tela no editor de design, com a lógica de estado no `<script>` (o que acontece ao clicar, filtrar, virar o card). Use para entender o comportamento, não como código para copiar.

As telas usam os componentes `sn-*` do design system e, para o que é só daquela tela, classes locais declaradas no `<style>` do próprio HTML. Transforme essas peças em componentes React, também só com tokens:

| Prefixo | Onde | Vira |
| --- | --- | --- |
| `st-` | Estudar (escolha) | `TopicTile` (matéria selecionável com check), `SelectableDeckRow`, banner "Revisão de hoje", painel "Sua sessão" |
| `ss-` | Sessão de estudo | barra de foco (Sair, título, tempo), dica de atalhos, lista "Para rever" |
| `fx-` | Flashcards e Comunidade | linha de busca e filtros, `DuePill` ("15 para hoje", "5 atrasados", "Em dia"), link que cobre o card inteiro |
| `cd-` | Criar deck | etapas numeradas, prévia de perguntas e respostas com destaque para as sem resposta |
| `dk-` | Detalhe do deck | cabeçalho, menu "…", números do deck, lista de cards com `CardStatusPill` e edição na própria linha |
| `pf-` | Perfil e Assinatura | seções em card, modal/folha de trocar senha, aviso de pagamento, histórico de pagamentos |

Pílulas de situação ("Para hoje", "Atrasado", "Em N dias", "Novo", "Dominado") são um componente só, com variantes. No celular, filtros e o modal de senha abrem como folha inferior, presa à parte de baixo da tela.

## Textos

Português do Brasil, tratando o usuário por "você". Botões no infinitivo e só com a primeira letra maiúscula ("Criar conta", "Mostrar resposta"). Sem exclamação no dia a dia e sem emoji. Números no padrão brasileiro (1.284 · 78% · R$ 24,90). O guia completo está em `docs/design-system/README.md`, seção "Voz e texto".

## Autenticação

- A API fica em `api.<domínio>` e grava dois cookies `httpOnly`, `Secure`, `SameSite=Lax` no domínio pai: o de acesso, que dura pouco, e o de renovação. O front nunca lê nem guarda tokens.
- O cliente chama a API com `credentials: "include"`. Os Server Components repassam o cabeçalho `cookie` da requisição.
- `proxy.ts` só checa se o cookie de sessão existe e redireciona `(app)/*` para `/entrar`. A autorização de verdade é sempre da API.
- Uma resposta 401 tenta `POST /auth/refresh` uma vez e, se falhar, leva para `/entrar`.

## Variáveis de ambiente

```
NEXT_PUBLIC_API_URL=https://api.sinapse.local   # navegador
API_URL=http://localhost:3333                   # servidor (Server Components)
```

## Comandos

```
pnpm dev          # desenvolvimento
pnpm build        # build de produção
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm api:types    # openapi-typescript $API_URL/docs-json -o src/lib/api/schema.d.ts
```

## Como trabalhar

- Antes de terminar qualquer tarefa, rode `pnpm lint` e `pnpm typecheck`.
- Ao criar uma tela, confira o visual contra o PNG de `docs/telas/` nos dois temas, em 1440px e em 390px de largura.
- Ordem sugerida: setup e tema → componentes `ui/` (Button, TextField, Tag, Chip, Avatar, ThemeToggle) → layout do app (Sidebar, BottomNav) → landing → auth → Início → Flashcards, Criar deck e detalhe do deck → Estudar e sessão → Comunidade e prévia → Perfil e Assinatura.
- Preços aparecem nas telas como "R$ [preço]": venha da API (`GET /billing/plans`), nunca fixo no código.
- Endpoint que ainda não existe na API: crie um mock tipado em `src/lib/api/mocks/` e anote no PR. Não invente o formato.
- Mudou `tokens.json`? Gere de novo `sinapse-theme.css` e atualize o guia; nunca ajuste cor direto no componente.
