# CRM de relacionamento · Peça Rara (RFV)

Protótipo de frontend do CRM de relacionamento da Peça Rara. Começa pelo relacionamento com **fornecedores**, modelado sobre a entidade **pessoa** para depois cobrir clientes. Inclui painel, segmentação RFV, campanhas, automações, templates, caixa de entrada da Central de WhatsApp e notificações.

> **Protótipo com dados fictícios.** Nada é enviado de verdade: não há backend, integração com a Meta, pr-notify ou DW. Os dados são gerados localmente e voltam ao estado inicial ao recarregar a página.

## Requisitos

- Node.js 20 ou superior (desenvolvido com Node 24)
- npm 10 ou superior

## Instalação

```bash
git clone <url-do-repositorio>
cd rfv
npm install
```

## Como rodar

```bash
npm run dev
```

Abre em `http://localhost:5173`. Para escolher host ou porta:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

## Outros comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com recarga automática |
| `npm run typecheck` | Verifica os tipos (`vue-tsc --noEmit`) |
| `npm run build` | Verifica os tipos e gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |

Antes de concluir uma mudança, rode `npm run typecheck` e `npm run build`.

## Stack

Vue 3 (`<script setup lang="ts">`), Vite, TypeScript, Tailwind CSS v4, Vue Router, Pinia, `lucide-vue-next` e Montserrat. Gráficos e animações são feitos só com SVG/CSS.

## Telas

| Rota | Tela |
|---|---|
| `/` | Painel |
| `/fornecedores` e `/fornecedores/:personId` | Lista e ficha do fornecedor |
| `/segmentos` | Segmentos RFV e matriz R × F |
| `/campanhas`, `/campanhas/nova`, `/campanhas/:campaignId` | Lista, wizard e detalhe de campanha |
| `/automacoes` | Automações reativas e proativas |
| `/templates` | Templates de mensagem |
| `/conversas` | Caixa de entrada da Central |
| `/notificacoes` | Envios e alertas |
| `/lojas` | Lojas e números da Central |

## Estrutura

```
src/
  assets/        tokens de tema (main.css) e imagens
  router/        rotas, com lazy load por módulo
  stores/        Pinia: escopo (rede/loja), rascunho de campanha e UI (menu recolhido)
  types/         tipos de domínio
  utils/         formatadores, máscara de dados pessoais, regras RFV
  composables/   lógica reutilizável (carregamento, toasts, confirmação)
  mocks/         dados fictícios determinísticos
  services/      única porta de acesso a dados (troque por API real aqui)
  components/    ui, domain, charts e layout
  modules/       uma pasta por tela, com views e components
```

Fluxo de dados: view → composable/store → `services/` → `mocks/`. Para ligar uma API real, altere apenas `services/`.

## Documentação do projeto

| Arquivo | Conteúdo |
|---|---|
| [`docs/agents/PRD.md`](docs/agents/PRD.md) | Escopo, telas, requisitos e critérios de aceite |
| [`AGENTS.md`](AGENTS.md) | Regras de código, idioma, nomenclatura e domínio |
| [`CLAUDE.md`](CLAUDE.md) | Orientações para o Claude Code |
| [`docs/agents/IMPLEMENTATION.md`](docs/agents/IMPLEMENTATION.md) | O que foi implementado, verificações e pendências |
| [`docs/agents/DESIGN.md`](docs/agents/DESIGN.md) | Guia visual |
| `docs/artifacts/` | Fontes de domínio: DW (`dw-diagram.txt`), frentes paralelas e fluxos |

## Convenções

Código em inglês; português só na interface e na descrição dos docblocks. Arquivos `.vue` em `PascalCase`, arquivos `.ts` em `kebab-case` e pastas em minúsculas. Detalhes em `AGENTS.md`.
