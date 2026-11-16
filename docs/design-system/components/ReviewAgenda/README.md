# ReviewAgenda

A agenda de revisão da Início: uma faixa com os próximos 7 dias e quantos cards vencem em cada um, e abaixo a lista de decks do dia escolhido, com o botão para revisar.

## Markup

```html
<section class="sn-agenda" aria-labelledby="ag-title">
  <div class="sn-agenda__head">
    <h3 class="sn-agenda__title" id="ag-title">Agenda de revisão</h3>
    <span class="sn-tag sn-tag--brand">57 cards na semana</span>
  </div>
  <ol class="sn-agenda__days">
    <li><button class="sn-agenda__day" aria-pressed="true" aria-label="Hoje, domingo 15, 32 cards">Hoje<span class="sn-agenda__date">15</span><span class="sn-agenda__load">32</span></button></li>
    …
  </ol>
  <ul class="sn-agenda__list">
    <li class="sn-agenda__item">
      <div class="sn-agenda__main"><span class="sn-agenda__name">Fisiologia renal</span><span class="sn-agenda__sub">Fisiologia · 2º ano</span></div>
      <span class="sn-count">12</span>
    </li>
  </ul>
  <button class="sn-btn sn-btn--primary sn-btn--block"><i data-lucide="play"></i> Revisar os 32 de hoje</button>
</section>
```

## Regras

- A faixa começa em "Hoje" e mostra 7 dias. Dia escolhido em `primary` / `on-primary`; dias sem revisão mostram "–".
- Cada botão de dia tem `aria-label` completo ("Segunda 16, 8 cards"): a faixa visual abrevia.
- Lista: um item por deck com cards vencendo no dia. Atrasados vêm primeiro, com `sn-count--accent` e "atrasado desde …" no subtítulo.
- O botão de revisar só aparece para "Hoje" e leva a uma sessão com exatamente esses cards. Em dias futuros, a lista é só informativa.
- Hoje sem nada: "Nada para revisar hoje" em `sn-agenda__empty` e um botão secundário "Estudar algo novo".
- No celular a faixa continua com 7 colunas (dias de 44px); a lista mostra no máximo 4 decks e "Ver todos".

## O que você fornece

As datas de próxima revisão de cada card (vindas do algoritmo de repetição espaçada) agrupadas por dia e por deck.
