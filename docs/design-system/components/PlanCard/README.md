# PlanCard

Card de plano da aba Assinatura (dentro do Perfil): nome, preço, o que inclui e, no plano atual, a data de renovação e o acesso para gerenciar.

## Markup

```html
<div class="sn-plans">
  <section class="sn-plan sn-plan--current">
    <div class="sn-plan__head"><h3 class="sn-plan__name">Pro mensal</h3><span class="sn-tag sn-tag--accent"><i data-lucide="crown"></i> Seu plano</span></div>
    <div class="sn-plan__price"><b>R$ 24,90</b><span>/mês</span></div>
    <ul class="sn-plan__list"><li><i data-lucide="check"></i>Decks e cards ilimitados</li>…</ul>
    <div class="sn-plan__status"><i data-lucide="credit-card"></i> Renova em 15 dez 2026 · cartão final 4417</div>
    <button class="sn-btn sn-btn--secondary sn-btn--block">Gerenciar assinatura</button>
  </section>
</div>
```

## Regras

- Plano atual: borda de 2px `primary` e o selo "Seu plano" (`sn-tag--accent` com `crown`). Ação secundária "Gerenciar assinatura".
- Outro plano: ação primária ("Mudar para o anual", "Assinar o Pro"). No máximo um primário na tela.
- Preço em `stat-value` com "R$" e vírgula decimal; período em `ink-muted`. Equivalência mensal em `sn-plan__note`.
- Itens com `check` em `primary`; no máximo 5 por plano.
- Assinatura vencendo ou pagamento recusado: troque o `sn-plan__status` por um aviso em `warning-soft` / `warning` com o que fazer ("Atualize o cartão até 20 nov para não perder o acesso").
- Os valores do preview são exemplos; troque pelos preços reais.

## Perfil

A aba Perfil reúne: [Avatar](../Avatar/README.md) editável, Nome e Sobrenome editáveis, Email (somente leitura), "Trocar senha" (botão secundário que abre modal com senha atual e nova), [ThemeToggle](../ThemeToggle/README.md) no celular, a seção Assinatura com estes cards e, por último, "Sair da conta" (`sn-btn--danger`).
