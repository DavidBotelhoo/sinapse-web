# Button

Ações da interface, do "Criar conta" da landing ao "Mostrar resposta" do estudo; no máximo um botão primário por tela.

## Markup

```html
<button class="sn-btn sn-btn--primary">Criar conta</button>
<button class="sn-btn sn-btn--secondary sn-btn--sm"><i data-lucide="bookmark"></i> Salvar deck</button>
<button class="sn-btn sn-btn--primary sn-btn--lg sn-btn--block">Mostrar resposta <span class="sn-kbd">Espaço</span></button>
```

## Variantes

| Classe | Quando usar |
| --- | --- |
| `sn-btn--primary` | A ação da tela: Criar conta, Entrar, Mostrar resposta, Estudar novamente, Criar deck. Uma por tela. |
| `sn-btn--secondary` | Ação ao lado da principal: Escolher novos temas, Salvar deck, Gerenciar assinatura. |
| `sn-btn--ghost` | Ações de navegação leves: Ver todos, Cancelar. |
| `sn-btn--accent` | Só para assinatura (Assinar o Pro). O coral é a cor de conquista, não de ação comum. |
| `sn-btn--danger` | Sair da conta, Excluir deck. Sempre com confirmação para excluir. |
| `sn-btn--on-primary` | Botão contornado sobre fundo `primary` (painel deslizante do login). |

Tamanhos: padrão 44px (`size-control`), `sn-btn--sm` 36px dentro de cards, `sn-btn--lg` 52px para a ação do estudo. `sn-btn--block` ocupa a largura; `sn-btn--icon` é quadrado e exige `aria-label`.

## Estados

- Hover escurece (`primary-hover`) ou preenche com `surface-2`; pressionado encolhe para 98%.
- Carregando: `aria-busy="true"` com o ícone `loader-circle`, que gira; o texto vira gerúndio ("Lendo arquivo…").
- Foco: contorno `focus` de 2px a 2px de distância (vem do CSS base).
- Evite `disabled`. Deixe o botão ativo e explique o erro no campo quando ele for usado.

## O que você fornece

O texto (verbo no infinitivo, em minúsculas depois da primeira letra: "Criar conta", não "Criar Conta"), o ícone Lucide opcional à esquerda (ou à direita para "seguir em frente", como `arrow-right`), e o `type` correto em formulários.

## Não faça

- Dois primários lado a lado: em "Estudar novamente" + "Escolher novos temas", o segundo é secundário.
- Botão só com ícone sem `aria-label`.
- Texto branco fixo: use as classes, que trocam para `on-primary` (tinta escura sobre a lima no escuro).
