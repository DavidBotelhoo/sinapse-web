# FileDrop

Área para importar um PDF ou Word com perguntas e respostas e transformá-lo em deck, com a linha do arquivo mostrando leitura, sucesso ou aviso.

## Markup

```html
<label class="sn-drop">
  <span class="sn-drop__icon"><i data-lucide="cloud-upload"></i></span>
  <p class="sn-drop__title">Arraste seu PDF ou Word aqui, ou <span class="sn-link">escolha um arquivo</span></p>
  <p class="sn-drop__hint">.pdf ou .docx · até 20 MB · uma pergunta e uma resposta por bloco</p>
  <input type="file" accept=".pdf,.docx" class="sn-sr">
</label>

<div class="sn-file">
  <span class="sn-file__badge">PDF</span>
  <div class="sn-file__main">
    <span class="sn-file__name">Farmacologia_SNA_resumo.pdf</span>
    <div class="sn-progress" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100"><span style="--value:64%"></span></div>
    <span class="sn-file__meta">Lendo perguntas… 64%</span>
  </div>
  <button class="sn-iconbtn" aria-label="Cancelar"><i data-lucide="x"></i></button>
</div>
```

## Estados

- **Repouso:** borda tracejada `line-strong`. **Arrastando por cima** (`data-dragover`) ou hover: borda `primary`, fundo `primary-soft`, ícone vira `primary` cheio.
- **Lendo:** barra `sn-progress` + "Lendo perguntas… N%".
- **Pronto:** `sn-file__meta--ok` com o número de perguntas encontradas.
- **Aviso:** `sn-file__meta--warn` quando há perguntas sem resposta; deixe revisar antes de criar.
- **Erro** (formato ou tamanho): use o erro do [TextField](../TextField/README.md) abaixo da área: "Esse arquivo é .pages. Exporte como PDF ou Word."

## Fluxo de Criar deck

1. Arquivo (este componente).
2. Nome do deck ([TextField](../TextField/README.md)).
3. Ano do curso (Chip, escolha única) e Matérias (Chip, múltipla).
4. Visibilidade: `sn-tabs--block` com "Privado" e "Público" (padrão: Privado), com uma linha explicando que decks públicos aparecem na Comunidade com o primeiro nome do autor.
5. Botão primário "Criar deck", só válido com arquivo lido, nome, ano e ao menos uma matéria.

No desktop, Criar deck é uma página dentro de Flashcards, em duas colunas: à esquerda o arquivo e a prévia dos cards lidos (perguntas sem resposta destacadas em `warning-soft`), à direita os detalhes e o botão "Criar deck", que fica fixo ao rolar. No celular, é uma tela cheia sem a barra inferior, com "Criar deck" preso ao fundo.

## O que você fornece

O parser (PDF/DOCX → pares pergunta/resposta), o progresso real e o resultado da contagem. A área inteira é clicável e alcançável por teclado.
