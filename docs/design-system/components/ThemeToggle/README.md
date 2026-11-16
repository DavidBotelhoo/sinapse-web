# ThemeToggle

Seletor de tema no rodapé da sidebar (desktop) e na tela de Perfil (celular): Claro é o tema Plantão, Escuro é o tema Madrugada.

## Markup

```html
<div class="sn-theme" role="radiogroup" aria-label="Tema" data-value="light">
  <span class="sn-theme__thumb" aria-hidden="true"></span>
  <button class="sn-theme__opt" role="radio" aria-checked="true" data-v="light"><i data-lucide="sun"></i> Claro</button>
  <button class="sn-theme__opt" role="radio" aria-checked="false" data-v="dark"><i data-lucide="moon"></i> Escuro</button>
</div>
```

## Comportamento

- Ao trocar, atualize `data-value` no grupo, `aria-checked` nas opções e `data-theme="light|dark"` no `<html>`. Todos os tokens viram sozinhos.
- Primeira visita: siga `prefers-color-scheme` do aparelho. Depois, salve a escolha (localStorage e perfil do usuário) e aplique o `data-theme` antes da primeira pintura para não piscar.
- O marcador desliza em `--dur-base`; com movimento reduzido, troca na hora.

## O que você fornece

O estado atual e a função que grava a preferência. Em Next.js, aplique o atributo num script inline no `<head>` (ou use `next-themes` com `attribute="data-theme"`).

## Não faça

- Ícone sol/lua sozinho sem texto na sidebar: aqui há espaço para a palavra.
- Um terceiro estado "Sistema" escondido: se quiser oferecer, vire três opções visíveis.
