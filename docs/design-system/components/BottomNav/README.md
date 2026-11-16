# BottomNav

Barra inferior do celular com cinco botões, nesta ordem: Início, Flashcards, Estudar, Comunidade e Perfil; Estudar é um play redondo maior, elevado acima da barra.

## Markup

```html
<nav class="sn-bottomnav" aria-label="Navegação principal">
  <a class="sn-bottomnav__item" href="/inicio" aria-current="page"><span class="sn-bottomnav__icon"><i data-lucide="house"></i></span>Início</a>
  <a class="sn-bottomnav__item" href="/flashcards"><span class="sn-bottomnav__icon"><i data-lucide="layers"></i></span>Flashcards</a>
  <a class="sn-bottomnav__item sn-bottomnav__item--play" href="/estudar"><span class="sn-bottomnav__play"><i data-lucide="play"></i></span>Estudar</a>
  <a class="sn-bottomnav__item" href="/comunidade"><span class="sn-bottomnav__icon"><i data-lucide="users"></i></span>Comunidade</a>
  <a class="sn-bottomnav__item" href="/perfil"><span class="sn-bottomnav__icon"><i data-lucide="user"></i></span>Perfil</a>
</nav>
```

## Regras

- Fixe no rodapé (`position: fixed; inset: auto 0 0`) abaixo de 768px e dê ao conteúdo `padding-bottom` de `size-bottom-nav` + a área segura.
- O play: `size-play` (60px), fundo `primary`, ícone `on-primary` preenchido, sobe 26px acima da barra. O anel de 6px na cor `bg` recorta a barra e a sombra `shadow-play` dá o brilho. É sempre o botão mais forte da tela.
- Toque no play leva direto à aba Estudar (escolha de temas). Se o usuário não tem flashcards, a aba Estudar mostra o [EmptyState](../EmptyState/README.md).
- Item ativo: pílula `primary-soft` atrás do ícone e rótulo em `ink`. Rótulos sempre visíveis (11px), nunca só ícone.
- Perfil aqui substitui o rodapé da sidebar: lá ficam dados da conta, tema, assinatura e Sair da conta.
- Esconda a barra durante uma sessão de estudo para dar a tela toda ao flashcard; um botão "Encerrar" no topo volta.
