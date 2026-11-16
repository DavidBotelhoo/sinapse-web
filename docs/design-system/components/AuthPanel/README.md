# AuthPanel

Login e cadastro numa peça só, com transição entre os dois: no desktop um painel colorido desliza e revela o outro formulário (login à direita, cadastro à esquerda); no celular, login e cadastro são as duas faces de um card que vira.

## Markup

```html
<div class="sn-auth" data-mode="login">                     <!-- "login" | "signup" -->
  <div class="sn-auth__brand-mobile"><span class="sn-wordmark">Sinapse</span></div>
  <div class="sn-auth__stage">
    <section class="sn-auth__panel sn-auth__panel--signup" aria-label="Criar conta" inert>
      <div class="sn-auth__head"><h1 class="sn-auth__title">Criar conta</h1><p class="sn-auth__sub">Leva menos de um minuto.</p></div>
      <form class="sn-form">…Nome | Sobrenome, Email, Senha, botão "Criar conta", termos…</form>
      <p class="sn-auth__switch">Já tem conta? <button class="sn-link" data-to="login">Entrar</button></p>
    </section>
    <section class="sn-auth__panel sn-auth__panel--login" aria-label="Entrar">
      <div class="sn-auth__head"><h1 class="sn-auth__title">Entrar</h1><p class="sn-auth__sub">Que bom te ver de novo.</p></div>
      <form class="sn-form">…Email, Senha (com "Esqueci minha senha"), botão "Entrar"…</form>
      <p class="sn-auth__switch">Ainda não tem conta? <button class="sn-link" data-to="signup">Criar conta</button></p>
    </section>
    <div class="sn-auth__overlay">
      <div class="sn-auth__pattern"></div>
      <span class="sn-auth__orb sn-auth__orb--a"></span><span class="sn-auth__orb sn-auth__orb--b"></span><span class="sn-auth__orb sn-auth__orb--c"></span>
      <div class="sn-auth__pitch sn-auth__pitch--login">…"Novo por aqui?" + botão "Criar conta" (data-to="signup")…</div>
      <div class="sn-auth__pitch sn-auth__pitch--signup" inert>…"Já tem conta?" + botão "Entrar" (data-to="login")…</div>
    </div>
  </div>
</div>
```

## Como funciona

| | Desktop (componente com mais de 720px) | Celular (até 720px) |
| --- | --- | --- |
| Login | Formulário na metade **direita**; painel `primary` cobre a esquerda com "Novo por aqui?" | Face da frente do card |
| Cadastro | Painel desliza para a direita (`--dur-auth`, 680ms, `--ease-in-out`); formulário aparece na metade **esquerda** | O card gira 180° em Y e mostra o verso |
| Trocar | Botão no painel colorido | Link "Criar conta" / "Entrar" no pé de cada face |

- O formulário que não está em uso some de verdade: `opacity: 0`, `visibility: hidden` e `inert` (sem foco nem leitor de tela). O que entra aparece com fade depois de metade do deslize.
- O modo segue a largura do próprio componente (container query), não da janela.
- Ao trocar, mova o foco para o primeiro campo do formulário que entrou, depois da transição.
- Com movimento reduzido, tudo troca na hora.

## Rotas

Use `data-mode` a partir da URL: `/entrar` abre "login", `/criar-conta` abre "signup". O botão "Criar conta" da landing leva ao cadastro e o "Entrar", ao login. Atualize a URL com `history.replaceState` ao alternar.

## Regras

- Cadastro pede Nome, Sobrenome, Email e Senha. Login pede só Email e Senha.
- Os dois formulários usam [TextField](../TextField/README.md) e [Button](../Button/README.md); o botão do painel colorido é `sn-btn--on-primary`.
- Painel colorido: fundo `primary`, texto `on-primary` (tinta escura sobre a lima no tema escuro), grade de pontos em `primary-hover` e três círculos (`primary-hover`, `accent`, `on-primary`) — as "sinapses".
- Erros de login não dizem qual campo errou: "Email ou senha não conferem."
