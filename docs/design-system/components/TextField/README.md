# TextField

Campo de formulário com rótulo em cima, ícone opcional, dica e mensagem de erro; serve para Nome, Sobrenome, Email, Senha, Nome do deck e seleções como Ano do curso.

## Markup

```html
<div class="sn-field">
  <label class="sn-field__label" for="email">Email</label>
  <div class="sn-field__control">
    <i data-lucide="mail"></i>
    <input id="email" type="email" autocomplete="email" placeholder="voce@faculdade.edu.br">
  </div>
  <p class="sn-field__hint">…</p>
  <p class="sn-field__error"><i data-lucide="circle-alert"></i> Confira o email: falta o final, como .com</p>
</div>
```

- Senha: botão `sn-field__toggle` com `aria-pressed` e `aria-label` "Mostrar senha"/"Esconder senha", trocando `eye`/`eye-off`.
- Link ao lado do rótulo ("Esqueci minha senha"): envolva rótulo e link em `sn-field__labelrow`.
- Seleção: `<select>` dentro do `sn-field__control` + `<i data-lucide="chevron-down" class="sn-field__chevron">`.
- Dois campos lado a lado (Nome | Sobrenome): `sn-field-row`; vira uma coluna no celular.
- Agrupe campos em `sn-form` (16px entre eles).

## Estados

| Estado | Visual |
| --- | --- |
| Repouso | `surface`, borda `line-strong` (3:1) |
| Hover | borda `ink-muted` |
| Foco | borda `primary` + halo de 3px `primary-soft` |
| Erro (`data-invalid` no `sn-field`, `aria-invalid` no input) | borda `danger`, mensagem `danger` com ícone; a dica some |

## Formulários do app

- **Criar conta:** Nome, Sobrenome, Email, Senha (hint "Mínimo de 8 caracteres.").
- **Entrar:** Email, Senha (com "Esqueci minha senha").
- **Criar deck:** Nome do deck, Ano do curso, Matérias ([Chip](../Chip/README.md)), Visibilidade.
- **Perfil:** Nome, Sobrenome (editáveis), Email (somente leitura), Trocar senha.

## Regras de texto

- Rótulo curto, sem dois-pontos. Placeholder é um exemplo real, nunca repete o rótulo.
- Valide ao sair do campo, não a cada tecla. Erro diz o que fazer: "Use pelo menos 8 caracteres.", "Esse email já tem conta. Entre ou recupere a senha."
- `autocomplete` certo em todos (`given-name`, `family-name`, `email`, `current-password`, `new-password`).
