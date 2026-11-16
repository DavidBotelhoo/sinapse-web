# EmptyState

Tela ou bloco sem conteúdo, escrito como convite: um desenho de cartas, um título que diz o próximo passo, uma linha de contexto e um botão.

## Markup

```html
<div class="sn-empty">
  <div class="sn-empty__art" aria-hidden="true">
    <span class="sn-empty__card"></span><span class="sn-empty__card"></span>
    <span class="sn-empty__card"><i data-lucide="plus"></i></span>
  </div>
  <h2 class="sn-empty__title">Monte seu primeiro deck para começar a estudar</h2>
  <p class="sn-empty__body">Você ainda não tem flashcards salvos. Importe um PDF ou Word, ou salve um deck pronto da Comunidade.</p>
  <div class="sn-empty__actions"><a class="sn-btn sn-btn--primary" href="/flashcards">Ir para Flashcards</a></div>
</div>
```

## Textos por lugar

| Lugar | Título | Botão |
| --- | --- | --- |
| Estudar, sem flashcards | Monte seu primeiro deck para começar a estudar | Ir para Flashcards (primário) |
| Flashcards › Meus | Crie seu primeiro deck | Criar deck |
| Flashcards › Favoritos | Marque decks com a estrela para achá-los aqui | Ver todos |
| Comunidade, filtros sem resultado | Nenhum deck com esses filtros | Limpar filtros (secundário) |
| Início, nenhum deck estudado | Seus decks estudados aparecem aqui | Estudar agora |

## Regras

- O título diz o que fazer, não lamenta ("Nada aqui ainda" não serve).
- Um botão principal; um segundo, se existir, é secundário.
- O desenho é sempre o mesmo (três cartas em leque, a da frente em `primary-soft`); troque só o ícone da carta da frente se fizer sentido (`plus`, `search`, `star`).
