# Implementação — protótipo do CRM RFV (fornecedores)

Estado em 28/10/2026. Protótipo de frontend com **dados mockados**; nada é enviado de verdade. Regras de código em `AGENTS.md` (raiz), escopo em `PRD.md` (mesma pasta), visual em `DESIGN.md` (mesma pasta).

## Como rodar

```
npm install
npm run dev        # http://127.0.0.1:5173
npm run typecheck  # vue-tsc, sem erros
npm run build      # build de produção, rotas em lazy load
```

## Stack

Vue 3 (`<script setup lang="ts">`), Vite, TypeScript estrito, Tailwind v4 (tokens em `src/assets/main.css`), Vue Router, Pinia, `lucide-vue-next`, Montserrat (`@fontsource-variable`). Sem biblioteca de gráficos nem de animação: tudo em SVG/CSS.

## Telas (rotas)

| Rota | Módulo | O que tem |
|---|---|---|
| `/` | `dashboard` | KPIs (ativos, novos, em risco, valor vendido, contactáveis), donut por segmento, evolução mensal, campanhas em execução, alertas |
| `/fornecedores` | `people` | Lista com busca, filtros (segmento, faixa, canal contactável, app, R/F vindos da matriz), ordenação, paginação |
| `/fornecedores/:personId` | `people` | Ficha: cartões R/F/V com tendência, indicadores, linha do tempo filtrável, matriz de consentimentos canal × finalidade, identificadores mascarados e cadastros de origem |
| `/segmentos` | `segments` | 8 segmentos com regra, matriz R × F clicável, limiares (marcados como provisórios) |
| `/campanhas` | `campaigns` | Lista com filtro por status |
| `/campanhas/nova` | `campaigns` | Wizard de 5 passos (objetivo, público, canal e template, regras, revisão) com simulador de alcance e custo |
| `/campanhas/:campaignId` | `campaigns` | Funil do tratado, tratado × holdout, cascata do público (opt-out por camada), regras, `not_after`, pausar/retomar |
| `/automacoes` | `automations` | Reativas (Central) e proativas (motor), com fluxo em etapas e liga/desliga |
| `/templates` | `templates` | Status Meta, categoria esperada × categoria Meta, template travado, prévia estilo WhatsApp, envio para análise (simulado) |
| `/conversas/:conversationId?` | `conversations` | Caixa de entrada em 3 painéis, janela de 24h, automação pausada por echo, composer que só aceita template com a janela fechada |
| `/notificacoes` | `notifications` | Abas Envios (log estilo `fato_mensagem`, bloqueio por camada) e Alertas |
| `/lojas` | `shops` | Número da Central, qualidade, coexistência, capacidade, mensagens e custo |

## Arquitetura

```
src/
  assets/             main.css (tokens, transições e animações) e images/logo.svg
  router/             rotas lazy por módulo (caminhos em português)
  stores/             Pinia: escopo (rede/loja), rascunho de campanha e UI (menu recolhido)
  types/              tipos de domínio em inglês, com o nome do DW nos docblocks
  utils/              formatters, máscara de PII, regras RFV, rótulos, tons, consentimento
  composables/        use-async-data, use-debounced, use-toast, use-confirm
  mocks/              dados determinísticos (seed fixa, "hoje" = 2026-10-28)
  services/           única porta de acesso a dados (async, latência simulada)
  components/
    ui/               Base* e estados (card, botão, tabela genérica, modal, toast, tooltip, skeleton…)
    domain/           badges e bolha de WhatsApp compartilhados
    charts/           donut, barras, colunas, funil e heatmap RFV
    layout/           AppShell, AppSidebar (menu lateral esquerdo, recolhível, com logo e seletor de loja no topo), AppTopbar (mobile), AppLogo e navigation
  modules/<feature>/  views + components de cada tela
```

Camadas: view → composable/store → `services/` → `mocks/`. Trocar por API real mexe só em `services/`.

## Interface e feedback

- **Toasts** de sucesso, erro, alerta e informação (`use-toast`), com cor, ícone e fechamento.
- **Diálogo de confirmação** (`use-confirm`) para ações sensíveis: pausar campanha, desligar automação, simular envio.
- **Carregamento**: skeletons por seção, spinner nos botões (`loading`), toggle com spinner, estados de erro com "Tentar de novo" e estados vazios.
- **Validação inline** nos formulários do wizard (nome, holdout, janela).
- **Efeitos leves**: só CSS em `opacity` e `transform` (hover, press, fade/pop de modal, drawer do menu, toasts, barras de progresso), respeitando `prefers-reduced-motion`.
- **Performance**: rotas em lazy load, sem libs de animação ou gráficos, busca com debounce, descarte de respostas antigas.
- **Menu recolhível**: no desktop, botão recolhe a sidebar para ícones (84px) com tooltip no hover/foco; preferência salva em `localStorage`.
- **Responsivo**: conteúdo ocupa toda a largura; sidebar vira drawer com topbar, tabelas com rolagem, conversas em um painel por vez no mobile.

## Regras de domínio refletidas

Nada é enviado (avisos e "Simular envio"); telefone, e-mail e documento sempre mascarados; holdout só registrado, fora do funil, com data de corte; opt-out mostrado por camada (Campanhas, pr-notify, Central); um canal por pedido promocional e SMS fora do promocional; template travado por categoria divergente; janela de 24h; echo pausa a automação; segmentos e limiares sinalizados como provisórios.

## Convenções aplicadas

Código em inglês (arquivos, funções, variáveis, tipos); português só na UI e nos docblocks. Nomes do DW preservados como valores de enum (`promocional`, `consignacao`, `bko_fornecedor`…) e citados nos docblocks. `.vue` em PascalCase, `.ts` em kebab-case, pastas minúsculas. Docblocks curtos com `@param`, `@returns`, `@throws`; sem comentários inline óbvios.

## Verificação feita

- `vue-tsc --noEmit` sem erros; `vite build` com um chunk por rota.
- Os 83 arquivos `.vue` passam no `vue-tsc` e no `vite build` (contagem de 28/10/2026, depois do menu recolhível e do `BaseTooltip`).
- No Chrome (desktop e 390px): painel, fornecedores, segmentos, conversas, automações e notificações carregam sem erros no console.
- Sidebar à esquerda com logo e seletor de loja no topo conferida no desktop, expandida e recolhida (tooltip no hover). Drawer mobile (~390px, simulado em iframe) conferido: abre pelo botão de menu, mostra logo, seletor de loja, "Nova campanha" e os grupos (a lista rola), e fecha ao navegar para outra tela.
- Wizard de campanha percorrido até o fim (objetivo, público, template, regras, revisão), com diálogo de confirmação, toast de sucesso e detalhe da campanha marcada como simulada.
- Ajustes feitos nos testes: segmento "Fiéis" estava vazio no mock; prévia de template mostrava `{{1}}` cru (agora preenche exemplos); "−0" na cascata do público; nome do contato truncado no cabeçalho da conversa.
- Não conferido: ficha da pessoa, templates, lojas e detalhe de campanha em mobile; comparação pixel a pixel com o site da Peça Rara.

## Limitações e pendências

- Estado em memória: recarregar a página volta ao estado inicial.
- Escopo de loja filtra pessoas pela loja; não há perfil separado por escopo (RF-16 fica para depois).
- Filtros da lista não são persistidos na URL (só segmento, R e F entram por query).
- Editor de template e edição de limiares RFV (RF-52, RF-22) não implementados.
- Os gráficos usam valores ilustrativos.
- Sem testes automatizados.
