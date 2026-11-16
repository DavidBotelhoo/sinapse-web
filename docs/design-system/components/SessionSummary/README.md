# SessionSummary

O fechamento da sessão de estudo: taxa de acerto em anel, divisão Errei/Difícil/Fácil, tempo, streak e os dois caminhos, "Estudar novamente" e "Escolher novos temas".

## Markup

```html
<section class="sn-summary" aria-labelledby="sum-title">
  <div class="sn-summary__hero">
    <div class="sn-ring" role="img" aria-label="78% de acerto">
      <svg viewBox="0 0 120 120"><circle class="sn-ring__track" cx="60" cy="60" r="52"/><circle class="sn-ring__value" cx="60" cy="60" r="52" stroke-dasharray="254.9 326.7"/></svg>
      <div class="sn-ring__label"><b>78%</b><span>de acerto</span></div>
    </div>
    <div><h2 class="sn-summary__title" id="sum-title">Sessão concluída</h2><p class="sn-summary__sub">20 cards … em 14 minutos.</p></div>
  </div>
  <div class="sn-breakdown">
    <div class="sn-breakdown__bar"><span class="sn-mark--again" style="--n:3"></span><span class="sn-mark--hard" style="--n:5"></span><span class="sn-mark--easy" style="--n:12"></span></div>
    <ul class="sn-breakdown__legend"><li><span class="sn-dot sn-mark--again"></span>Errei <b>3</b></li>…</ul>
  </div>
  <dl class="sn-summary__facts">…Tempo · Por card · Streak…</dl>
  <div class="sn-summary__actions">
    <button class="sn-btn sn-btn--primary">Estudar novamente</button>
    <button class="sn-btn sn-btn--secondary">Escolher novos temas</button>
  </div>
</section>
```

## Regras

- Anel: `stroke-dasharray` = (taxa × 326,7) e 326,7 (circunferência de r=52). Cor `primary` sobre trilho `surface-2`.
- Barra dividida: cada segmento com `--n` igual à contagem; a legenda sempre mostra os números (a cor não fala sozinha).
- Fatos: Tempo total, Tempo médio por card, Streak. O streak em `accent-ink` com `flame` só quando a sessão aumentou a sequência.
- "Estudar novamente" refaz exatamente os mesmos cards ou temas. "Escolher novos temas" volta para a seleção da aba Estudar.
- Título "Sessão concluída". Se a taxa for alta (≥ 90%), troque o subtítulo por um reconhecimento curto ("Mandou bem: 18 de 20 de primeira."), sem exclamação em excesso nem confete.
- Celular: o card vira tela cheia; os botões ficam empilhados e presos ao fundo.
