# DeckCard

Card de um deck, desenhado como um maço com duas cartas aparecendo atrás; mostra ano, matérias, nome, quantidade de cards e, conforme o contexto, progresso, dono ou visibilidade.

## Markup

```html
<div class="sn-decks">
  <a class="sn-deck" href="/flashcards/farmaco-sna">
    <div class="sn-deck__top">
      <div class="sn-tags"><span class="sn-tag">2º ano</span><span class="sn-tag sn-tag--brand">Farmacologia</span></div>
      <button class="sn-iconbtn" aria-label="Favoritar" aria-pressed="true"><i data-lucide="star"></i></button>
    </div>
    <h3 class="sn-deck__title">Farmacologia do sistema nervoso autônomo</h3>
    <div class="sn-deck__meta"><span><i data-lucide="layers"></i>84 cards</span><span><i data-lucide="clock"></i>há 2 dias</span></div>
    <div class="sn-progress"><span style="--value:62%"></span></div>
  </a>
</div>
```

## Variantes por contexto

| Onde | O que muda |
| --- | --- |
| Início, "Últimos decks estudados" | Mostra os 4 mais recentes + link "Ver todos" no título da seção. Meta: cards e "há N dias". Barra de domínio. |
| Flashcards, "Meus" | Tag de visibilidade (`lock` Privado / `globe` Público) no canto. Meta: cards e "N para hoje". |
| Flashcards, "Da comunidade" e "Favoritos" | Estrela de favorito no canto (`sn-iconbtn`, preenchida em `accent-ink` quando marcada). |
| Comunidade | Rodapé com avatar e **só o primeiro nome** do dono ("por Marina") e o botão "Salvar" (`bookmark`), que vira "Salvo" (`bookmark-check`, ghost). Use `sn-deck--interactive` quando o card não é um link inteiro. |
| Criar novo deck | `sn-deck--new`: borda tracejada, play de "+" em `primary`, "Criar novo deck" e "Importe um PDF ou Word". Abre o fluxo do [FileDrop](../FileDrop/README.md). |

## Regras

- Ordem fixa das tags: ano primeiro, depois até 3 matérias; o excedente vira "+N".
- O nome pode quebrar em duas linhas; corte com reticências na terceira.
- O card inteiro abre a tela de detalhe do deck (cards, domínio, para hoje, estudar). Na Comunidade, abre a prévia do deck antes de salvar. Botões internos (favoritar, salvar) param a propagação do clique.
- Grade `sn-decks`: preenche colunas de no mínimo 240px; no celular, os 4 recentes ficam num carrossel horizontal com o card de "Criar novo deck" por último.
- O maço atrás (duas sombras sólidas em `surface-2` e `line`) é a assinatura visual do deck: não substitua por borda colorida lateral.
