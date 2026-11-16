# Chip

Opção clicável em forma de pílula: escolher o ano e as matérias ao criar um deck, e mostrar os filtros ativos com um "x" para remover.

## Markup

```html
<!-- escolha única (ano do curso) -->
<div class="sn-chips" role="radiogroup" aria-label="Ano do curso">
  <button class="sn-chip" role="radio" aria-checked="true"><i data-lucide="check" class="sn-chip__check"></i>2º ano</button>
  <button class="sn-chip" role="radio" aria-checked="false"><i data-lucide="check" class="sn-chip__check"></i>3º ano</button>
</div>

<!-- escolha múltipla (matérias) -->
<button class="sn-chip" aria-pressed="true"><i data-lucide="check" class="sn-chip__check"></i>Farmacologia</button>

<!-- filtro ativo -->
<span class="sn-chip sn-chip--removable">2º ano
  <button class="sn-chip__remove" aria-label="Remover filtro 2º ano"><i data-lucide="x"></i></button>
</span>
```

## Estados

- Desligado: `surface` com borda `line-strong`.
- Ligado (`aria-checked` ou `aria-pressed` = true): `primary-soft`, borda `primary`, texto `on-primary-soft` e o check aparece. O check garante que o estado não dependa só da cor.
- Removível: sempre ligado, com botão "x" de 24px que tem `aria-label` próprio.

## Onde aparece

- Criar deck: Ano do curso (única, obrigatória), Matérias (múltipla, pelo menos uma).
- Popover de filtro em Flashcards e Comunidade (ver [FilterBar](../FilterBar/README.md)).
- Lista de filtros ativos acima dos resultados.

## O que você fornece

A lista de opções (anos e matérias vêm do curso do usuário; hoje, Medicina), o estado e o handler. Em listas longas de matérias, mostre as 8 mais usadas e um campo de busca.
