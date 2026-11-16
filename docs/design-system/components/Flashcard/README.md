# Flashcard

O cartão da sessão de estudo: mostra a pergunta, o estudante pensa no próprio tempo, toca para virar e vê a resposta; aí aparecem os botões de avaliação.

## Markup

```html
<div class="sn-study">
  <div class="sn-study__bar"><span class="sn-num">3 / 20</span><div class="sn-progress"><span style="--value:15%"></span></div></div>

  <div class="sn-flashcard" data-flipped="false" role="button" tabindex="0" aria-label="Flashcard. Toque para ver a resposta.">
    <div class="sn-flashcard__inner">
      <div class="sn-flashcard__face sn-flashcard__face--front">
        <div class="sn-flashcard__meta"><span>Farmacologia · 2º ano</span><span class="sn-tag">Pergunta</span></div>
        <p class="sn-flashcard__text">Qual o principal mecanismo de ação da metformina?</p>
        <p class="sn-flashcard__hint">Pense na resposta. Depois toque no card ou aperte Espaço.</p>
      </div>
      <div class="sn-flashcard__face sn-flashcard__face--back" aria-live="polite">
        <div class="sn-flashcard__meta"><span class="sn-flashcard__eyebrow"><i data-lucide="sparkles"></i> Resposta</span></div>
        <p class="sn-flashcard__recall">Qual o principal mecanismo de ação da metformina?</p>
        <p class="sn-flashcard__text sn-flashcard__text--long">Reduz a produção hepática de glicose…</p>
      </div>
    </div>
  </div>

  <button class="sn-btn sn-btn--primary sn-btn--lg sn-btn--block">Mostrar resposta <span class="sn-kbd">Espaço</span></button>
  <!-- depois de virar: RatingButtons no mesmo lugar -->
</div>
```

## Comportamento

1. **Pergunta:** sem cronômetro pressionando; o tempo aparece discreto na barra de cima.
2. **Virar:** toque no card, no botão "Mostrar resposta", Espaço ou Enter. Gira em Y em `--dur-slow` (420ms). Com movimento reduzido, troca com fade.
3. **Avaliar:** os [RatingButtons](../RatingButtons/README.md) ocupam o lugar do botão (sem pular a tela). Teclas 1, 2, 3.
4. **Próximo:** ao avaliar, o próximo card entra deslizando da direita, já do lado da pergunta. Não há botão "próximo": a avaliação avança.
5. **Fim:** depois do último card, vá para o [SessionSummary](../SessionSummary/README.md).

## Texto

- Pergunta e resposta em `card-question` (Bricolage 24px). Acima de ~110 caracteres, use `sn-flashcard__text--long` (Figtree `body-lg`) para não virar um muro.
- O verso repete a pergunta pequena (`sn-flashcard__recall`) para o estudante comparar.
- Meta: matéria e ano do deck. No celular, o card ocupa a largura toda com `space-6` de padding e altura mínima maior; a barra inferior some durante a sessão.

## O que você fornece

A fila de cards da sessão, o handler de avaliação (que grava a resposta e calcula a próxima revisão) e o tempo da sessão.
