# RatingButtons

Os três botões de autoavaliação depois de ver a resposta: Errei, Difícil e Fácil; escolher um registra a resposta e avança para o próximo card.

## Markup

```html
<div class="sn-rate" role="group" aria-label="Como você foi?">
  <button class="sn-rate__btn sn-rate__btn--again"><i data-lucide="x"></i> Errei <span class="sn-kbd">1</span></button>
  <button class="sn-rate__btn sn-rate__btn--hard"><i data-lucide="minus"></i> Difícil <span class="sn-kbd">2</span></button>
  <button class="sn-rate__btn sn-rate__btn--easy"><i data-lucide="check"></i> Fácil <span class="sn-kbd">3</span></button>
</div>
```

## Cores e significado

| Botão | Fundo | Texto | Marca (gráficos) | Ícone |
| --- | --- | --- | --- | --- |
| Errei | `again-soft` | `on-again-soft` | `again` | `x` |
| Difícil | `hard-soft` | `on-hard-soft` | `hard` | `minus` |
| Fácil | `easy-soft` | `on-easy-soft` | `easy` | `check` |

Essas seis cores só existem no estudo e no resumo da sessão. Não use para status de outras coisas.

## Regras

- Sempre na ordem Errei, Difícil, Fácil, da esquerda para a direita, com palavra e ícone: a cor nunca é a única pista.
- Ficam no lugar do "Mostrar resposta" e só aparecem com o card virado.
- Atalhos 1, 2, 3 no teclado; o selo `sn-kbd` some em telas de toque.
- Altura de 56px, ocupando a largura em três colunas iguais, inclusive no celular (alvo de toque confortável para o polegar).
- Opcional, quando o algoritmo existir: uma segunda linha pequena com o próximo intervalo ("1 min", "10 min", "4 dias").
