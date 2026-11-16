# StatCard

Card de número da Início: os quatro indicadores Streak, Cards estudados, Horas estudadas (na semana) e Taxa de acerto, cada um com um detalhe visual próprio.

## Markup

```html
<div class="sn-stats">
  <section class="sn-stat sn-stat--streak" aria-label="Streak">
    <div class="sn-stat__head"><span class="sn-stat__icon"><i data-lucide="flame"></i></span>Streak</div>
    <div class="sn-stat__value">12<span class="sn-stat__unit">dias</span></div>
    <div class="sn-week">
      <span class="sn-week__day" data-done>S</span> … <span class="sn-week__day" data-today>D</span>
    </div>
  </section>
  …
</div>
```

## Os quatro cards

| Card | Ícone | Número | Detalhe |
| --- | --- | --- | --- |
| Streak (`sn-stat--streak`) | `flame` em `accent-soft` | dias seguidos | Semana S T Q Q S S D: dias estudados em `accent`, hoje com anel `accent-ink` |
| Cards estudados | `list-checks` | total da semana | Variação contra a semana anterior (`sn-stat__meta--up` em `success` quando sobe; neutra quando cai) |
| Horas estudadas | `clock` | "6h40min" da semana | Mini barras `sn-spark` por dia; hoje em `primary` |
| Taxa de acerto | `target` | % | Barra `sn-progress` e a regra do cálculo |

## Regras

- Número em `stat-value` com algarismos tabulares; unidade menor em `ink-muted`.
- Grade `sn-stats`: 4 colunas no desktop, 2 no celular (os cards encolhem até 150px).
- Só o Streak usa a cor de destaque. Os outros ficam na cor da marca.
- Streak zerado: "0 dias" e meta "Estude hoje para começar". Não use tom de bronca.
- Taxa de acerto: defina e mostre a regra. Sugestão: (Fácil + Difícil) ÷ total avaliado nos últimos 7 dias.
- Use números reais do usuário; sem dados, mostre "—" e uma linha explicando quando aparecem.
