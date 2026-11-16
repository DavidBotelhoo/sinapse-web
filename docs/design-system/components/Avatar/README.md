# Avatar

Foto de perfil redonda, ou as iniciais do nome quando não há foto; aparece na sidebar, no card de deck da comunidade e no Perfil.

## Markup

```html
<span class="sn-avatar sn-avatar--sm"><img src="/u/ana.jpg" alt=""></span>
<span class="sn-avatar">AS</span>

<!-- Perfil: editável -->
<span class="sn-avatar-edit">
  <span class="sn-avatar sn-avatar--xl"><img src="…" alt="Foto de Ana Souza"></span>
  <button class="sn-avatar-edit__btn" aria-label="Trocar foto de perfil"><i data-lucide="camera"></i></button>
</span>
```

## Tamanhos

| Classe | px | Onde |
| --- | --- | --- |
| `sn-avatar--xs` | 24 | Dono do deck em listas densas |
| `sn-avatar--sm` | 32 | Card de deck da comunidade, sidebar |
| (padrão) | 40 | Cabeçalho no celular |
| `sn-avatar--lg` | 72 | Cabeçalho do Perfil no celular |
| `sn-avatar--xl` | 112 | Perfil, com botão de editar |

## Regras

- Iniciais: primeira letra do nome + primeira do sobrenome, em `display` 700, `on-primary-soft` sobre `primary-soft`.
- Na Comunidade, mostre só o primeiro nome do dono ao lado do avatar ("por Ana"), nunca o sobrenome nem o email.
- Avatar ao lado do nome escrito é decorativo: `alt=""` (ou `aria-hidden`). Sozinho, precisa de `alt` com o nome.
- Upload: recorte quadrado, mínimo 256px, JPG/PNG/WebP até 5 MB.
