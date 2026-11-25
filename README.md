# Sinapse · web

Landing page e app do Sinapse, um app de flashcards por assinatura para estudantes de Medicina. Next.js 16 (App Router), Tailwind CSS v4 e TanStack Query. A API fica no repositório `sinapse-api`.

## Requisitos

- Node 24 LTS (mínimo 20.9) e pnpm 9.
- A API rodando em `http://localhost:3333` (veja abaixo).

## Rodar com a API local

1. Suba a API, no repositório `sinapse-api`:

   ```bash
   docker compose up -d        # postgres, redis e mailpit
   pnpm prisma migrate dev
   pnpm prisma db seed         # curso de Medicina e as matérias
   pnpm start:dev              # http://localhost:3333 (docs em /docs)
   ```

   No `.env` da API, `WEB_URL=http://localhost:3000` e `COOKIE_DOMAIN=localhost`.

2. Aqui no front:

   ```bash
   pnpm install
   cp .env.example .env.local
   pnpm dev                    # http://localhost:3000
   ```

   `.env.local`:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3333   # navegador
   API_URL=http://localhost:3333               # servidor (Server Components)
   ```

Abra o app em `localhost`, não em `127.0.0.1`: a API grava os cookies de sessão no domínio `localhost`.

Para testar a assinatura sem gateway, a API usa o provedor de teste (`BILLING_PROVIDER=fake`). Os eventos de pagamento são simulados na API com `pnpm billing:simulate <email> <aprovado|recusado|cancelado|teste-terminado>`.

## Comandos

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Desenvolvimento, em `http://localhost:3000` |
| `pnpm build` | Build de produção |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm api:types` | Gera `src/lib/api/schema.d.ts` a partir de `${API_URL}/docs-json`; rode depois de cada mudança na API |

## Onde está cada coisa

- `CLAUDE.md`: stack, estrutura de pastas e regras do design system.
- `docs/produto.md`: o que o app faz, tela por tela.
- `docs/telas/`: as telas aprovadas (PNG, SVG e HTML), nos dois temas, no desktop e no celular.
- `docs/design-system/`: tokens, guia da marca e componentes.
