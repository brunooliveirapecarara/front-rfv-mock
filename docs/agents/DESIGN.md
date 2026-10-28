# Guia visual — CRM RFV

Segue o site da Peça Rara Brechó. Tom: acolhedor, leve, arredondado, muito espaço em branco, amarelo como assinatura. Valores aproximados medidos das capturas; ajustar após comparação lado a lado.

## Tokens (Tailwind v4 `@theme`)

| Token | Valor | Uso |
|---|---|---|
| `brand` | `#FFD53D` | botão primário, destaques, números grandes, fundos de ênfase |
| `brand-strong` | `#F5C518` | hover/pressed do primário, bordas de pílula |
| `brand-soft` | `#FFF3C2` | fundos de aviso/realce suave |
| `sand` | `#F0EFEC` | fundo de página e de seções alternadas, fundo dos cards internos |
| `surface` | `#FFFFFF` | cards, header, tabelas |
| `ink` | `#333333` | texto principal e títulos |
| `ink-muted` | `#6F6F6F` | texto secundário (contraste ≥ 4.5:1 sobre branco e sand) |
| `line` | `#E4E2DD` | divisórias e bordas discretas |
| `coral` | `#FF5A4F` | alerta, em risco, "Infantil" do site |
| `teal` | `#1E7F86` | sucesso/positivo, "Masculino" do site |
| `blue-info` | `#3B6FB6` | informativo (usar pouco) |

Tons semânticos de badge (fundo suave + texto escuro): `neutral`, `brand`, `success` (teal), `danger` (coral), `warning` (brand-soft + ink), `info`.

**Contraste**: amarelo **nunca** como cor de texto pequeno sobre branco. Só em títulos/números grandes decorativos (como o site) ou como fundo com texto `ink`. Texto sobre `brand` é sempre `ink`.

## Tipografia

- **Montserrat** (variável). Pesos: 400 texto, 500 rótulos, 600 botões/subtítulos, 700 títulos.
- Escala: página 32–40px/700; seção 24px/700; card 16–18px/600; corpo 14–16px/400; legenda 12px.
- Números de destaque (KPIs): 40–56px/700 em `brand` sobre fundo branco **apenas** quando acompanhados de rótulo `ink`; em telas densas, usar `ink`.
- Títulos de seção centralizados só em páginas de apresentação (ex.: painel); telas de trabalho usam alinhamento à esquerda.

## Forma

- Raio de card: `rounded-card` = **2rem (32px)**; cards pequenos/inner: `rounded-2xl` (16px); campos e tabelas: `rounded-xl`.
- Botões, chips, badges, abas e inputs de busca: **pílula** (`rounded-full`).
- Sombra: quase nenhuma; `shadow-card` muito suave (`0 8px 24px rgb(0 0 0 / 0.06)`) só em elementos elevados (modal, dropdown, card em hover).
- Bordas finas `line`; destaques por cor de fundo, não por borda pesada.

## Componentes

- **Botão primário**: fundo `brand`, texto `ink` 600, pílula, altura 40–44px, hover `brand-strong`. Opcional seta `→` (como "Conheça mais →").
- **Botão secundário**: fundo branco, borda 2px `brand`, texto `ink`; ícone à esquerda (como "Venda conosco").
- **Botão fantasma**: sem fundo, texto `ink`, hover `sand`.
- **Sidebar** (menu lateral esquerdo, 272px expandida e 84px recolhida): branca, borda direita `line`, logo (`src/assets/images/logo.svg`, via `AppLogo`) e botão de recolher no topo, seletor de loja (rede toda ou uma loja) logo abaixo, com rótulo "Loja" no estilo dos títulos de grupo (`BaseSelect` com `labelTone="section"`), botão primário "Nova campanha" e itens agrupados com ícone (item ativo em pílula `brand`, hover `sand`). Recolhida, mostra só os ícones, com tooltip à direita ao passar o mouse ou focar (`BaseTooltip`); a preferência fica salva no navegador. No mobile vira um drawer, sempre expandido, aberto por uma topbar com logo, alertas e menu.
- **Página**: fundo `sand`; conteúdo em cards brancos de raio 32px, espaçamento generoso (`gap-6`, padding 24–32px). Seções podem alternar faixa branca/sand como no site.
- **Card de passo/indicador** (como "Como funciona"): fundo `sand`, raio 32px, número grande em `brand` no canto, ícone em círculo branco, título 600, descrição `ink-muted`.
- **Card de categoria**: branco, raio 32px, título colorido (`brand`/`coral`/`teal`/`ink`) + descrição curta; usado para segmentos.
- **Tabela**: cabeçalho `sand`, linhas separadas por `line`, hover `sand/50`, primeira coluna com avatar circular.
- **Badge/chip**: pílula, 12px/600, tons semânticos.
- **Input/Select**: pílula, borda 2px `brand` ao foco (e `line` em repouso), fundo branco; select com seta como "Selecione a região".
- **Ícones**: `lucide`, traço fino (1.5px), em `ink`; ícone de destaque em `brand`. Estilo "line icon" como os do site.
- **Gráficos**: paleta limitada (`brand`, `ink`, `teal`, `coral`, tons de `sand`); barras arredondadas; rótulos diretos; sem grades pesadas.
- **Aviso de protótipo**: `BaseAlert` tom `brand-soft` fixo no topo das telas de envio: "Simulação — nenhuma mensagem é enviada".

## Layout das telas (resumo)

- Conteúdo ocupa toda a largura disponível ao lado da sidebar, gutters de 16px (mobile) a 40px (desktop).
- Grade de 12 colunas; KPIs em 4 colunas (2 no tablet, 1 no mobile).
- Ficha da pessoa: coluna principal (RFV, timeline) + coluna lateral (identificadores, consentimentos, cadastros).
- Caixa de entrada: 3 painéis (lista, conversa, contexto da pessoa); no mobile, um painel por vez.

## Movimento

Transições curtas (150–200ms) de cor/sombra/opacidade. Sem animações decorativas longas; respeitar `prefers-reduced-motion`.

## Imagens

O site usa fotos de pessoas e ilustrações; o CRM **não** reutiliza fotos. Usar avatares com iniciais (círculo `brand-soft`, texto `ink`) e ícones de linha.
