# Tag

Rótulo estático de uma ou duas palavras: ano do curso, matéria, visibilidade do deck, selo de plano; para contagens use `sn-count`.

## Markup

```html
<span class="sn-tag">2º ano</span>
<span class="sn-tag sn-tag--brand">Farmacologia</span>
<span class="sn-tag sn-tag--outline"><i data-lucide="lock"></i> Privado</span>
<span class="sn-count">32</span>
```

## Variantes

| Classe | Uso |
| --- | --- |
| `sn-tag` (neutra) | Ano do curso ("2º ano"). Sempre a primeira tag de um deck. |
| `sn-tag--brand` | Matérias. Máximo de 3 visíveis no card; o resto vira "+2". |
| `sn-tag--outline` | Visibilidade: `globe` Público, `lock` Privado. Só nos decks do próprio usuário. |
| `sn-tag--accent` | Selos de conquista e atenção: "Seu plano", "Atrasado". |
| `sn-count` / `sn-count--accent` | Número de cards a revisar, contadores das abas e da sidebar. |

## Regras

- Tag não é clicável. Para filtrar ou escolher, use [Chip](../Chip/README.md).
- Ano sempre como ordinal com "ano": "1º ano" … "6º ano". Matéria com inicial maiúscula e nome completo ("Farmacologia", não "Farmaco").
- Ícones de 14px, só quando ajudam a ler (visibilidade, plano).
