# Sidebar

Navegação principal no desktop: marca no topo, as quatro abas (Início, Estudar, Flashcards, Comunidade) e, no rodapé, a troca de tema e o acesso ao perfil e à conta.

## Markup

```html
<div class="sn-app">
  <aside class="sn-sidebar" aria-label="Navegação principal">
    <div class="sn-sidebar__brand"><a class="sn-wordmark" href="/inicio">Sinapse</a></div>
    <nav class="sn-nav">
      <a class="sn-navitem" href="/inicio" aria-current="page"><i data-lucide="house"></i>Início</a>
      <a class="sn-navitem" href="/estudar"><i data-lucide="play"></i>Estudar <span class="sn-count">32</span></a>
      <a class="sn-navitem" href="/flashcards"><i data-lucide="layers"></i>Flashcards</a>
      <a class="sn-navitem" href="/comunidade"><i data-lucide="users"></i>Comunidade</a>
    </nav>
    <div class="sn-sidebar__foot">
      <!-- ThemeToggle -->
      <a class="sn-profilelink" href="/perfil">
        <span class="sn-avatar sn-avatar--sm">AS</span>
        <span class="sn-profilelink__text"><span class="sn-profilelink__name">Ana Souza</span><span class="sn-profilelink__sub">Perfil e assinatura</span></span>
        <i data-lucide="settings"></i>
      </a>
    </div>
  </aside>
  <main class="sn-main">…</main>
</div>
```

## Regras

- Ordem fixa das abas: Início, Estudar, Flashcards, Comunidade. Ícones: `house`, `play`, `layers`, `users`.
- Aba atual: `aria-current="page"`, fundo `primary-soft`, texto `on-primary-soft`.
- O contador em Estudar mostra os cards que vencem hoje; some quando é zero. Nada de contador nas outras abas.
- Rodapé: [ThemeToggle](../ThemeToggle/README.md) e o link do perfil (avatar, nome, "Perfil e assinatura", ícone `settings`). Sair da conta fica dentro do Perfil, não aqui.
- Largura `size-sidebar` (248px), fixa ao rolar (`position: sticky`).

## Tamanhos de tela

| Largura | Navegação |
| --- | --- |
| ≥ 1024px | Esta sidebar completa |
| 768–1023px | Sidebar compacta de 80px: só ícones com `aria-label` e tooltip; tema vira um botão de ícone |
| < 768px | Some. Entra a [BottomNav](../BottomNav/README.md) |
