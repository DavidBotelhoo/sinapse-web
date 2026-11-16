# SegmentedTabs

Abas em trilho para trocar o recorte de uma lista sem sair da tela: "Todos", "Meus", "Da comunidade" e "Favoritos" no topo da aba Flashcards.

## Markup

```html
<div class="sn-tabs" role="tablist" aria-label="Filtrar flashcards">
  <button class="sn-tabs__tab" role="tab" aria-selected="true">Todos <span class="sn-count">128</span></button>
  <button class="sn-tabs__tab" role="tab" aria-selected="false">Meus <span class="sn-count">24</span></button>
  <button class="sn-tabs__tab" role="tab" aria-selected="false">Da comunidade <span class="sn-count">96</span></button>
  <button class="sn-tabs__tab" role="tab" aria-selected="false">Favoritos <span class="sn-count">8</span></button>
</div>
```

## Regras

- "Todos" vem selecionado ao abrir a aba Flashcards.
- O contador é opcional; quando aparece, fica `primary-soft` só na aba selecionada.
- No celular o trilho rola na horizontal (sem barra visível); não quebre em duas linhas.
- Teclado: setas esquerda/direita trocam de aba (padrão WAI-ARIA tabs); o painel usa `role="tabpanel"`.
- Trocar de aba mantém os filtros de ano e matéria aplicados.

## Variante em bloco

`sn-tabs--block` divide a largura igualmente. Use como seletor de duas ou três opções em formulário, por exemplo a **Visibilidade** do deck (Privado | Público), com `role="radiogroup"`/`role="radio"` e `aria-checked` na opção escolhida (o estilo de selecionado vale para `aria-selected` e para `aria-checked`).
