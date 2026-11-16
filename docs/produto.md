# Sinapse — especificação do produto

Sinapse é um app web (desktop e celular) de flashcards por assinatura. O público inicial são estudantes de Medicina; o modelo de dados já nasce preparado para outros cursos. Interface em português do Brasil.

O projeto tem dois repositórios:

- `sinapse-web`: Next.js + TypeScript + Tailwind (landing e app).
- `sinapse-api`: NestJS + TypeScript + PostgreSQL (API REST, filas, pagamentos).

O contrato entre eles é a especificação OpenAPI gerada pela API (`/docs-json`). O front gera o cliente tipado a partir dela.

Todas as telas abaixo foram desenhadas e aprovadas. No repositório do front, `docs/telas/` tem cada tela e cada estado em PNG, SVG e HTML, nos temas claro e escuro, no desktop (1440px) e no celular (390px). Quando este texto e a tela divergirem, vale a tela.

---

## 1. Landing page

Página pública de divulgação.

- Topo: nome "Sinapse", links de seção, botão **Entrar** (secundário) e **Criar conta** (primário).
- Hero: título curto do que o app faz, **Criar conta** e "Ver como funciona", com um flashcard de exemplo e dois cards de estatística ao lado.
- Seções: como funciona (importe → estude → revise na hora certa), para quem (estudantes de Medicina, do 1º ao 6º ano), planos e um último **Criar conta**.
- "Criar conta" leva a `/criar-conta`; "Entrar" leva a `/entrar`.

## 2. Entrar e Criar conta

- **Criar conta** pede: Nome, Sobrenome, Email, Senha (mínimo de 8 caracteres).
- **Entrar** pede: Email e Senha, com o link "Esqueci minha senha".
- **Desktop:** os dois formulários ficam no mesmo painel. Login na metade **direita**, cadastro na metade **esquerda**. Só um aparece por vez; um painel colorido cobre a outra metade e desliza para revelar o outro formulário.
- **Celular:** login e cadastro são as duas faces de um card; trocar faz o card girar.
- Erro de login não diz qual campo errou: "Email ou senha não conferem."
- Recuperação de senha: email com link de redefinição (token de uso único com validade).

## 3. Navegação

- **Desktop:** sidebar com 4 abas, nesta ordem: Início, Estudar (com o número de cards para hoje), Flashcards, Comunidade. No rodapé: troca de tema (Claro/Escuro) e o acesso ao Perfil (avatar, nome e "Perfil e assinatura").
- **Celular:** sem sidebar. Barra inferior com 5 botões, nesta ordem: Início, Flashcards, **Estudar** (botão de play redondo, maior e elevado), Comunidade, Perfil.
- A sessão de estudo é uma tela de foco: some a sidebar no desktop e a barra inferior no celular.
- No celular, Criar deck também é tela cheia, sem a barra inferior.

## 4. Início

- Saudação "Olá, [primeiro nome]", com a data e quantos cards vencem hoje.
- Quatro cards de estatística:
  - **Streak:** dias seguidos com pelo menos uma revisão, mais os dias da semana atual marcados.
  - **Cards estudados:** avaliações na semana atual, com a variação contra a semana anterior.
  - **Horas estudadas:** tempo de estudo na semana atual, com as barrinhas por dia.
  - **Taxa de acerto:** (Difícil + Fácil) ÷ total de avaliações nos últimos 7 dias.
- **Últimos decks estudados:** os 4 mais recentes, com "% dominado", e o link **Ver todos**. Cada deck abre a tela de detalhe do deck.
- Área **Criar novo deck** com "Importar arquivo".
- **Agenda de revisão:** os próximos 7 dias com a quantidade de cards que vencem em cada um. Ao escolher um dia, aparece a lista de decks; atrasados ficam em coral. Em "Hoje", o botão "Revisar os N de hoje".

## 5. Estudar

**Escolha (`/estudar`)**

- No topo, o atalho **Revisão de hoje**: quantos cards vencem hoje, em quantos decks, o tempo estimado e quantos estão atrasados, com o botão "Revisar agora".
- **Monte sua sessão**, com duas abas:
  - **Por tema** (padrão): grade de matérias. Cada uma mostra quantos cards tem, o ano e a situação ("15 para hoje", "5 atrasados" ou "Em dia"). Seleção múltipla.
  - **Por deck:** lista dos decks com caixa de seleção, ano, matéria, quantidade de cards, dono (se for da comunidade) e a situação.
- **Sua sessão** (painel ao lado no desktop, barra presa ao fundo no celular): os itens escolhidos (removíveis), quantos cards, quantos pendentes e o tempo estimado.
  - **Quantos cards:** 10, 20 (padrão), 30 ou Todos.
  - **Ordem:** Pendentes primeiro (padrão) ou Misturar.
  - Botão "Começar sessão · N cards", desativado enquanto nada estiver escolhido.
- Sem flashcards salvos: estado vazio "Monte seu primeiro deck para começar a estudar", com **Ir para Flashcards** (primário) e **Explorar a Comunidade**.

**Sessão**

1. Mostra a pergunta, com matéria e ano. Sem cronômetro pressionando: o tempo aparece discreto no topo.
2. O usuário toca no card, no botão "Mostrar resposta" ou aperta Espaço. O card vira e mostra a pergunta pequena em cima e a resposta.
3. Avalia: **Errei**, **Difícil** ou **Fácil** (teclas 1, 2, 3). Os botões ocupam o lugar do "Mostrar resposta".
4. Avaliar já avança para o próximo card. No topo: posição ("3 / 20"), barra de progresso e "Sair".

**Fim da sessão**

- Anel com a taxa de acerto, barra dividida Errei/Difícil/Fácil com os números, tempo total, tempo médio por card e streak.
- **Estudar novamente** (os mesmos cards) e **Escolher novos temas** (volta para a escolha).
- Lista **Para rever** com os cards que a pessoa errou, que voltam em breve pela repetição espaçada.
- "Voltar ao início".

## 6. Flashcards

- Lista todos os decks criados ou salvos pelo usuário.
- No topo, 4 abas com contagem: **Todos** (vem selecionada), **Meus**, **Da comunidade**, **Favoritos**. Botão **Criar deck**.
- Busca pelo nome do deck.
- Filtros por **ano do curso** e/ou **matéria** (independentes e combináveis). No desktop abrem um popover; no celular, uma folha inferior com as duas seções e o botão "Ver N decks". Filtros ativos aparecem como chips removíveis, com "Limpar filtros".
- Cada deck mostra: ano, matérias, estrela de favorito, nome, quantidade de cards, Privado/Público (se é seu) ou "por [primeiro nome]" (se é da comunidade), a situação de hoje e "% dominado" com barra.
- O último card da grade é "Criar novo deck".
- Estados vazios: filtros sem resultado ("Nenhum deck com esses filtros" + Limpar filtros), Favoritos vazio ("Marque decks com a estrela para achá-los aqui" + Ver todos), Meus vazio ("Crie seu primeiro deck" + Criar deck).
- Clicar num deck abre o **detalhe do deck**.

**Criar deck (`/flashcards/novo`)**

1. **Arquivo:** arrastar ou escolher um **PDF ou Word** (.pdf ou .docx, até 20 MB). Mostra a leitura com progresso, depois "48 perguntas com resposta encontradas" ou o aviso "46 prontas · 2 perguntas sem resposta".
2. **Prévia dos cards:** os primeiros pares lidos; os que vieram sem resposta ficam destacados em amarelo. Link para revisar e editar todos antes de criar.
3. **Detalhes:**
   - **Nome do deck**, sugerido a partir do nome do arquivo.
   - **Ano do curso** (um).
   - **Matérias** (uma ou mais), com as mais usadas visíveis e busca para as outras.
   - **Visibilidade:** Privado (padrão) ou Público, com a explicação de que o público aparece na Comunidade com o primeiro nome.
4. **Criar deck**, válido só com arquivo lido, nome, ano e ao menos uma matéria. Enquanto falta algo, uma linha diz o quê.

## 7. Detalhe do deck

A mesma tela tem três versões.

- **Meu deck (`/flashcards/[deckId]`):**
  - Cabeçalho com ano, matérias, nome, quantidade de cards, Privado/Público e "Atualizado há N dias".
  - Ações: **Estudar este deck**, estrela de favorito e o menu "…" com Editar nome e matérias, Publicar na Comunidade (ou Tornar privado), Importar mais cards e Excluir deck.
  - Quatro números: Domínio (%), Para hoje, Novos e Taxa de acerto do deck.
  - Lista de cards: abas Todos, Para hoje, Novos e Dominados, com contagem; busca no deck; "Mostrar respostas" liga e desliga as respostas (para se testar pela lista).
  - Cada card mostra a situação: Revisar hoje, Atrasado, Em N dias, Novo ou Dominado.
  - O lápis abre a edição ali mesmo (pergunta e resposta), com Salvar, Cancelar e Excluir card.
  - "Mostrando N de M" e "Carregar mais".
- **Salvo da comunidade (`/flashcards/[deckId]`):** igual, mas com "por [primeiro nome]" e "N salvaram" no lugar de Privado/Público, e sem edição. O menu tem Remover dos meus flashcards e Denunciar deck.
- **Prévia da comunidade (`/comunidade/[deckId]`), antes de salvar:**
  - Mostra o dono (só o primeiro nome e o avatar), quantos salvaram e um aviso de que, ao salvar, o deck vai para Flashcards e entra na agenda, com o progresso só da pessoa.
  - Mostra **6 cards** de amostra, sem situação, e o aviso "Prévia com 6 de N cards. Salve o deck para ver e estudar todos".
  - O botão principal é **Salvar deck**. Depois de salvar, a tela vira a versão salva, com todos os cards como Novo e o botão "Estudar agora".
  - O menu tem Denunciar deck.

## 8. Comunidade

- Busca por nome ou assunto, filtros por ano do curso e/ou matérias (como em Flashcards) e a ordem **Populares** (mais salvos) ou **Recentes**.
- Sem filtro: "1.248 decks públicos · mostrando os mais salvos". Com filtro: "N decks encontrados".
- Cada deck mostra: ano, matérias, nome, quantidade de cards, quantas pessoas salvaram, avatar e **só o primeiro nome** do dono.
- Botão **Salvar deck**, que vira **Salvo** (tocar de novo remove). O deck salvo aparece em Flashcards › Da comunidade.
- Clicar no deck abre a prévia (ou a versão salva, se já foi salvo).

## 9. Perfil

Duas abas: **Conta** e **Assinatura**.

**Conta**

- **Foto e nome:** foto com "Trocar foto" e "Remover" (JPG, PNG ou WebP, até 5 MB, recorte quadrado); Nome e Sobrenome editáveis; Email somente leitura; "Salvar alterações". Aviso de que na Comunidade só aparecem o primeiro nome e a foto.
- **Segurança:** Senha, com "Alterada há N meses" e **Trocar senha**. Abre um modal (folha inferior no celular) com Senha atual, Nova senha (mínimo de 8 caracteres) e Repita a nova senha.
- **Aparência** (só no celular, onde não há sidebar): Claro ou Escuro.
- **Sair da conta**, por último.

**Assinatura**

- Dois planos: **Pro mensal** e **Pro anual** ("2 meses grátis", com a equivalência por mês). Os preços ainda vão ser definidos e aparecem nas telas como "R$ [preço]".
- O mesmo conteúdo nos dois planos: decks e cards ilimitados, importação de PDF e Word, revisão espaçada com agenda, decks da Comunidade e estatísticas de estudo.
- Três situações:
  - **Ativa:** plano atual marcado com "Seu plano", renovação e cartão ("Renova em 15 dez 2026 · cartão final 4417"), "Gerenciar assinatura" e "Mudar para o anual".
  - **Pagamento recusado:** aviso no topo ("Não conseguimos cobrar seu cartão. Atualize a forma de pagamento até [data]..."), status em amarelo no plano e "Atualizar cartão" como ação principal.
  - **Sem assinatura (teste terminou):** aviso "Seu teste grátis terminou. Seus decks continuam salvos...", e "Assinar o mensal" e "Assinar o anual".
- **Pagamentos:** histórico (data, plano, cartão, valor, "Pago") e "Trocar cartão".
- "Cancelar assinatura" discreto, no fim.

---

## Regras de negócio

- **Repetição espaçada:** algoritmo FSRS (biblioteca `ts-fsrs`). Errei → `Rating.Again`, Difícil → `Rating.Hard`, Fácil → `Rating.Good`. O estado de revisão é **por usuário e por card**, inclusive em decks da comunidade.
- **Situação de um card para o usuário:**
  - **Novo:** nunca estudado.
  - **Revisar hoje:** vence hoje.
  - **Atrasado:** venceu antes de hoje.
  - **Em N dias:** vence no futuro.
  - **Dominado:** em revisão e com intervalo de 21 dias ou mais.
- **Domínio (% dominado)** de um deck = cards dominados ÷ cards do deck.
- **Situação de um deck ou matéria:** "N atrasados" se houver atrasados, senão "N para hoje" se houver cards vencendo hoje, senão "Em dia".
- **Tempo estimado** de uma sessão = cards × tempo médio por card do usuário (40 segundos enquanto não houver histórico).
- **Fuso horário:** streak, "semana atual" e agenda usam o fuso do usuário (salvo no perfil; padrão `America/Sao_Paulo`).
- **Semana:** de segunda a domingo.
- **Streak:** conta os dias seguidos com ao menos uma avaliação. Se o usuário ainda não estudou hoje, a sequência que vem até ontem continua valendo até o fim do dia.
- **Horas estudadas:** soma do tempo entre mostrar a pergunta e avaliar. Cada card conta no máximo 5 minutos, para não somar tempo ocioso.
- **Cursos:** Medicina tem 6 anos. Cada curso tem a própria lista de matérias. Todo deck pertence a um curso, um ano e uma ou mais matérias.
- **Privacidade na Comunidade:** nunca expor sobrenome, email nem foto em alta resolução de outros usuários; só o primeiro nome e o avatar.
- **Edição:** só o dono edita um deck e seus cards. Quem salvou um deck da comunidade só estuda.
- **Assinatura:** o status (em teste, ativa, pagamento recusado, cancelada, expirada) vem só dos webhooks do gateway de pagamento, nunca do front.

## Identidade visual

O design system está em `docs/design-system/` no repositório do front, e o `README.md` de lá é o guia da marca. Resumo:

- Tema claro **Plantão**: petróleo `#0e5c5e` e coral `#ff6a4d` sobre papel `#f5f2ec`.
- Tema escuro **Madrugada**: lima `#c5f03c` e coral `#ff7a5c` sobre petróleo profundo `#0a1817`.
- Fontes Bricolage Grotesque (títulos, números, texto do flashcard) e Figtree (interface).
- Ícones Lucide.

---

## Decisões em aberto

Para cada uma há uma recomendação; confirme antes de implementar a parte afetada.

1. **Deck da comunidade salvo é referência ou cópia?** Recomendação: referência (quem salvou recebe as correções do autor), com o progresso de revisão de cada usuário guardado à parte. Se o autor tornar o deck privado ou excluí-lo, ele some da Comunidade, mas quem já salvou continua com acesso, sem novas edições.
2. **Formato do arquivo importado.** Recomendação: aceitar um modelo simples ("P:" / "R:" ou pergunta em negrito e resposta abaixo) e usar um LLM como plano B para arquivos sem padrão. A prévia antes de criar já está desenhada.
3. **Preços dos planos.** As telas usam "R$ [preço]". Faltam o valor mensal e o anual.
4. **Período de teste.** As telas já preveem o fim do teste ("Seu teste grátis terminou"). Recomendação: 7 dias grátis, depois só leitura (vê os decks, não estuda nem importa) até assinar.
5. **Gateway de pagamento.** Precisa aceitar cartão recorrente e Pix no Brasil. A ser escolhido.
6. **Confirmação de email no cadastro.** Recomendação: deixar entrar na hora e pedir a confirmação para publicar decks e assinar.
7. **Moderação da Comunidade.** O botão "Denunciar deck" está desenhado. Falta a parte do admin: recomendação de uma fila de denúncias e a opção de ocultar o deck da Comunidade.

Decididas nas telas: edição de cards na página do deck (só o dono), sessão montada pelo usuário (quantidade e ordem) e prévia de 6 cards antes de salvar um deck da comunidade.
