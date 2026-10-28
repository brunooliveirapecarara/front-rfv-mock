# CLAUDE.md

@AGENTS.md

## Visão do projeto

Protótipo de frontend do **CRM de relacionamento da Peça Rara (RFV)**, com **dados mockados**. Primeira fase: relacionamento com **fornecedores**, sobre o conceito de **pessoa** (clientes entram depois). Inclui recursos essenciais de CRM, campanhas, automações, templates, caixa de entrada (Central de WhatsApp) e notificações — **sem enviar nada**.

Produto final (fora deste repositório por enquanto): aplicação de relacionamento (CRM + Central) lendo o DW `pr-data` e pedindo envios ao `pr-notify`, que entrega pela Central → Meta.

## Onde está cada coisa

| Preciso de… | Arquivo |
|---|---|
| Escopo, telas, requisitos, critérios de aceite | `docs/agents/PRD.md` |
| Regras de código, estrutura, regras de domínio | `AGENTS.md` (importado acima) |
| Visual (cores, tipografia, componentes) | `docs/agents/DESIGN.md` |
| Modelo de dados (DW, dimensões, fatos, perfis) | `docs/artifacts/dw-diagram.txt` (DBML, dbdiagram.io) |
| Planejamento, marcos, riscos | `docs/artifacts/Frentes paralelas do RFV.md` |
| Fluxos motor → pr-notify → Central → Meta | `docs/artifacts/Fluxos — motor, Central, pr-notify e Meta.md` |

Os arquivos em `docs/artifacts/` são fonte de verdade de domínio: não editar sem pedido. Se o código divergir deles, avise em vez de decidir sozinho.

## Como trabalhar aqui

- Conversa, UI e documentos em português (pt-BR). **Código em inglês** (arquivos, pastas, funções, variáveis, tipos); português só na UI e na descrição dos docblocks. Exceção: nomes que já existem no planejamento/DW. Ver "Idioma e nomenclatura" no `AGENTS.md`.
- Arquivos `.vue` em `PascalCase`; arquivos `.ts` em `kebab-case` minúsculo; pastas em minúsculas.
- Mudanças pequenas e coesas; reaproveite `components/ui` antes de criar algo novo.
- Respeite a camada de dados: view → composable/store → `services/` → `mocks/`.
- Termos do domínio (R/F/V, holdout, janela de 24h, finalidade, cadastro × pessoa) estão no glossário do `docs/agents/PRD.md`; use-os com o mesmo significado.
- Decisão de produto em aberto (ex.: regras de segmento, "parar" bloqueia só promocional ou o canal todo) → sinalize na tela como "provisório" e registre em `docs/agents/PRD.md` > Premissas, não invente silenciosamente.
- Sem comentários inline óbvios; documente funções com docblocks curtos (`@param`, `@returns`, `@throws`) conforme "Comentários e docblocks" no `AGENTS.md`.
- Não rode nem escreva nada que envie mensagem de verdade.

## Verificação antes de concluir

1. `npm run typecheck` e `npm run build` limpos.
2. `npm run dev` e abrir as rotas alteradas em desktop e em largura mobile (~390px).
3. Conferir com `docs/agents/DESIGN.md` (amarelo, areia, Montserrat, cards arredondados, botões em pílula).
4. Conferir as regras de domínio da seção correspondente no `AGENTS.md` (PII mascarada, holdout, opt-out, simulação).
