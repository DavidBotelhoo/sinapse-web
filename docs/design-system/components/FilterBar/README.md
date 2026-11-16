# FilterBar

Barra de filtros por Ano do curso e Matéria, usada em Flashcards e Comunidade: dois gatilhos que abrem popovers e, ao lado, os filtros ativos removíveis.

## Markup

```html
<div class="sn-filterbar">
  <div class="sn-filter">
    <button class="sn-chip sn-filter__trigger" aria-expanded="false" aria-controls="pop-ano">
      Ano do curso <i data-lucide="chevron-down" class="sn-filter__chevron"></i>
    </button>
    <div class="sn-popover" id="pop-ano" hidden>…chips de 1º a 6º…</div>
  </div>
  <div class="sn-filter">
    <button class="sn-chip sn-filter__trigger" aria-pressed="true" aria-expanded="true" aria-controls="pop-mat">
      Matéria · 2 <i data-lucide="chevron-down" class="sn-filter__chevron"></i>
    </button>
    <div class="sn-popover" id="pop-mat">
      <label class="sn-search"><i data-lucide="search"></i><input placeholder="Buscar matéria"></label>
      <ul class="sn-options" role="listbox" aria-multiselectable="true">
        <li><button class="sn-option" role="option" aria-checked="true"><span class="sn-check"><i data-lucide="check"></i></span>Farmacologia</button></li>
      </ul>
      <div class="sn-popover__foot">…Limpar · Aplicar…</div>
    </div>
  </div>
  <span class="sn-filterbar__divider" aria-hidden="true"></span>
  <span class="sn-chip sn-chip--removable">2º ano <button class="sn-chip__remove" aria-label="Remover filtro 2º ano">…</button></span>
  <button class="sn-btn sn-btn--ghost sn-btn--sm">Limpar filtros</button>
</div>
```

## Regras

- Ano e Matéria são independentes e combináveis ("e/ou"): o usuário pode usar só um, os dois ou nenhum.
- Gatilho com valor escolhido fica ligado (`aria-pressed="true"`) e mostra a contagem: "Matéria · 2". Com um ano só, mostre o valor: "2º ano".
- Popover de ano: chips de 1º a 6º (múltipla escolha). Popover de matéria: busca + lista com checkbox, "Limpar" e "Aplicar".
- Filtros ativos aparecem como chips removíveis à direita; "Limpar filtros" só quando há algum.
- Fecha com Esc e clique fora; o foco volta ao gatilho.
- Resultado vazio por causa dos filtros: estado vazio com "Nenhum deck com esses filtros" e o botão "Limpar filtros".

## Celular

Os gatilhos ficam numa linha que rola na horizontal. Ao tocar, abre uma folha inferior (`surface`, `radius-xl` só nos cantos de cima, `shadow-lg`, véu `scrim`) com as duas seções juntas e um botão "Ver N decks" fixo embaixo.
