# PRD — CRM de relacionamento (RFV) · protótipo de frontend

Versão 0.1 · 28/10/2026 · status: rascunho para revisão

## 1. Contexto e problema

A Peça Rara quer um programa de relacionamento com o fornecedor (comunicação, fornecimento, atração), hoje sem ferramenta própria: o dado está no BKO e no Pinóquio, sem visão única da pessoa, sem segmentação por RFV, sem controle de consentimento por canal e sem caixa de entrada para a Central de WhatsApp da rede.

O planejamento (`docs/artifacts/Frentes paralelas do RFV.md`) prevê uma **aplicação de relacionamento** (CRM + Central) fora do BKO, lendo o DW `pr-data` e pedindo envios ao `pr-notify`. Este protótipo antecipa a **experiência de uso** com dados mockados, para validar telas, vocabulário e fluxos com o time (gestor de CRM, lojas, jurídico) antes de existir backend.

## 2. Objetivos

1. Mostrar, de ponta a ponta e navegável, como o time usaria o CRM com fornecedores: enxergar a pessoa, segmentar por RFV, montar campanha, acompanhar resultado, atender conversas.
2. Fixar o **modelo mental** do domínio na UI: pessoa × cadastro × papel, finalidade × consentimento, tratado × holdout, janela de 24h.
3. Entregar uma base de código **componentizada, modular e reaproveitável**, pronta para trocar mocks por API e para estender a clientes.
4. Seguir a identidade visual do site Peça Rara.

**Não objetivos**: validar números reais, performance com milhões de linhas, segurança, integração com Meta/pr-notify/DW.

## 3. Personas

| Persona | Quer | Telas principais |
|---|---|---|
| **Gestor de CRM** (ainda sem nome definido, ver risco em Frentes paralelas) | definir segmentos, escrever templates, desenhar e medir campanhas | Painel, Segmentos, Campanhas, Templates, Automações |
| **Atendente de loja** | responder fornecedores, ver contexto e histórico | Conversas, Ficha da pessoa |
| **Franqueadora / rede** | ver saúde do canal, custo e qualidade por loja, conformidade | Painel, Lojas, Notificações |

## 4. Escopo do protótipo

**Dentro**: telas navegáveis com dados fictícios determinísticos; filtros, busca, paginação, ordenação e formulários funcionando localmente; wizard de campanha com simulação de alcance/custo; toggles de automação em memória.

**Fora**: envio real de qualquer mensagem; integração Meta, pr-notify, DW, RabbitMQ; autenticação/perfis; persistência (recarregar volta ao estado inicial); i18n (só pt-BR); testes automatizados (previstos para a fase seguinte).

## 5. Modelo de dados mockado ↔ DW

Os tipos de `src/types` (em inglês) correspondem a `docs/artifacts/dw-diagram.txt`; cada tipo/campo cita a tabela ou coluna de origem no docblock. Valores de enum do DW (finalidade, modalidade, origem do cadastro) mantêm o nome original.

| Conceito na UI | Origem no DW / aplicação |
|---|---|
| Pessoa | `dw.dim_pessoa` + `dw_pii.pessoa_contato` (mascarado) |
| Cadastro (por loja, app, Central) | `dw.dim_cadastro` |
| Identificadores (tel., e-mail, doc.) | `dw.dim_identificador` (exibidos só mascarados) |
| Perfil RFV (rede ou loja) | `dw.perfil_pessoa` (R, F, V, sell-through, lotes, devoluções, saldos…) |
| Evolução mensal | `dw.perfil_pessoa_mensal` |
| Loja | `dw.dim_loja` + número/qualidade da Central |
| Lotes, vendas, devoluções na timeline | `fato_lote`, `fato_venda_produto`, `fato_devolucao_fornecedor` |
| Log de envios | `dw.fato_mensagem` / `pr_notify.notifications` |
| Consentimento por canal × finalidade | `pr_notify.consents` |
| Segmento e nota | `mart_crm` (escrito pelo motor) |
| Campanha, braços, holdout, canal por pessoa | Campanhas (aplicação) |
| Template, finalidade, status Meta | pr-notify (autoria) + Central (submissão) |
| Conversa, mensagem, janela 24h | Central (`fato_conversa` no futuro) |

## 6. Telas e requisitos funcionais

Prefixo RF-. Prioridade: **P0** essencial para a demo, **P1** desejável.

### 6.1 Painel (`/`)
- RF-01 (P0) KPIs da rede/loja: fornecedores ativos (12m), novos, em risco, valor vendido 12m, taxa de contactáveis.
- RF-02 (P0) Distribuição por segmento (donut/barras) clicável → abre lista filtrada.
- RF-03 (P1) Evolução mensal de ativos/novos/reativados (a partir de `perfil_pessoa_mensal`).
- RF-04 (P1) Campanhas em andamento e alertas (template rejeitado, qualidade do número, opt-outs recentes).

### 6.2 Pessoas / Fornecedores (`/fornecedores`, `/fornecedores/:pessoaId`)
- RF-10 (P0) Lista paginada com busca por nome, filtros (segmento, loja, faixa de nota, contactável por canal, tem app) e ordenação por R, F, V, nota.
- RF-11 (P0) Cada linha: avatar, nome, UF, loja de referência, R/F/V, nota, segmento, canais contactáveis.
- RF-12 (P0) Ficha: cabeçalho com segmento e nota; cartões de R, F, V com comparação ao período anterior; sell-through, intervalo médio, recusas, devoluções, saldos (Moedas PR e cashback).
- RF-13 (P0) Ficha: identificadores **mascarados**, cadastros de origem (loja, app, Central) e papéis (fornecedor/cliente).
- RF-14 (P0) Ficha: consentimentos em matriz canal × finalidade (concedido / bloqueado / sem registro) com origem e data; destaque a "não comunicável".
- RF-15 (P0) Ficha: linha do tempo (lotes, vendas, devoluções, mensagens, conversas, mudanças de consentimento) com filtro por tipo.
- RF-16 (P1) Alternar escopo rede × loja na ficha (perfil por escopo).
- RF-17 (P1) Ação "Iniciar conversa" (abre Conversas) e "Adicionar a campanha" (leva ao wizard com a pessoa pré-selecionada) — sem envio.
- Reuso: o módulo recebe o **papel** (`fornecedor`|`cliente`) por rota; clientes entram depois sem novo módulo.

### 6.3 Segmentos (`/segmentos`)
- RF-20 (P0) Cartões dos segmentos (Campeões, Fiéis, Promissores, Novos, Esfriando, Em risco, Hibernando, Perdidos) com tamanho, % da base, regra em linguagem simples e ação "Ver pessoas".
- RF-21 (P0) Matriz RFV (heatmap R × F) com contagem; clicar numa célula filtra a lista.
- RF-22 (P1) Edição de limiares (R/F/V) com recálculo local e rótulo **provisório**.

### 6.4 Campanhas (`/campanhas`, `/campanhas/nova`, `/campanhas/:id`)
- RF-30 (P0) Lista com status (rascunho, agendada, em execução, concluída, pausada), canal, segmento, tratado/holdout, resultado.
- RF-31 (P0) Detalhe: público (elegíveis → menos sem consentimento → menos não comunicáveis → holdout → tratado), funil (pedidos, enviados, entregues, lidos, respostas, falhas), comparação **tratado × holdout** (taxa de retorno com peças), custo estimado e real, janela e `not_after`.
- RF-32 (P0) Wizard de nova campanha em 5 passos: objetivo → público (segmento, lojas, filtros) → canal e template (**um canal só**, template aprovado na categoria esperada) → regras (holdout %, teto por pessoa, cooldown, calendário, capacidade da loja) → revisão.
- RF-33 (P0) Simulador na revisão: alcance por canal (cobertura), exclusões por camada (opt-out, não comunicável, sem contato), custo estimado por mensagem entregue.
- RF-34 (P0) Botão **"Simular envio"** abre resumo de dry-run e confirma que **nada foi enviado**; a campanha vai para "agendada (simulada)".
- RF-35 (P1) Pausar/retomar localmente; duplicar campanha.

### 6.5 Automações (`/automacoes`)
- RF-40 (P0) Duas colunas conforme o fluxo decidido em 24/10: **Reativas** (Central: fora do horário, resposta a botão, palavra "SAIR", fluxo disparado pelo atendente) e **Proativas** (motor: fornecedores esfriando de uma marca numa loja, sequência do novo fornecedor, reengajamento, aniversário).
- RF-41 (P0) Cada automação: gatilho, condição, ação, canal, template, segmento, métricas simuladas, toggle ligar/desligar (em memória).
- RF-42 (P1) Visualização do fluxo (etapas) e aviso das regras: número de loja só aceita 3 automações; echo do atendente para a automação; mensagem de ausência em um lugar só.

### 6.6 Templates (`/templates`)
- RF-50 (P0) Lista com nome (`rfv.em_risco_marca`), finalidade (transacional/promocional/autenticação), canal, idioma, categoria esperada × categoria Meta, status (rascunho, em análise, aprovado, rejeitado, **categoria divergente = travado**), versão.
- RF-51 (P0) Pré-visualização estilo bolha de WhatsApp com variáveis e botões ("Quero levar peças", "Ver meu saldo").
- RF-52 (P1) Editor simples de corpo com variáveis e contagem; "Enviar para aprovação" simulado.

### 6.7 Conversas — Central (`/conversas`, `/conversas/:id`)
- RF-60 (P0) Caixa de entrada com filtros (aberta, aguardando, encerrada, por loja) e contador de não lidas.
- RF-61 (P0) Conversa: mensagens do fornecedor, do atendente, da automação e do template de campanha (com `campaignId`/braço); indicador da **janela de 24h** (tempo restante).
- RF-62 (P0) Fora da janela, o composer só permite escolher template; dentro, texto livre. O envio é **simulado** e sinalizado.
- RF-63 (P0) Painel lateral com ficha resumida da pessoa (segmento, RFV, consentimentos).
- RF-64 (P1) Indicar "atendente assumiu (echo): automação pausada".

### 6.8 Notificações (`/notificacoes`)
- RF-70 (P0) Aba **Envios**: log estilo `fato_mensagem` (data, pessoa, loja, canal, template, finalidade, origem, status, provedor, campanha/braço, custo) com filtros e detalhe de falha/bloqueio (opt-out em qual camada).
- RF-71 (P0) Aba **Alertas**: eventos do sistema (opt-out registrado, template rejeitado/travado, qualidade do número, cota, Central recusou) com severidade e leitura.
- RF-72 (P1) Contador de alertas na sidebar e sino na topbar mobile com contagem de alertas não lidos.

### 6.9 Lojas (`/lojas`)
- RF-80 (P0) Lista de lojas: cidade/UF, ativa, fornecedores ativos, número da Central (conectado/pendente), qualidade (alta/média/baixa), coexistência com app, capacidade de triagem.
- RF-81 (P1) Detalhe com fornecedores da loja e custo/volume de mensagens.

### 6.10 Transversais
- RF-90 (P0) Sidebar à esquerda com navegação agrupada, seletor de **loja** (rede toda ou uma loja) e atalho "Nova campanha"; no desktop pode ser recolhida para só ícones, com tooltip; no mobile, drawer.
- RF-91 (P0) Estados de carregamento, vazio e erro em todas as listas; atraso simulado nos serviços.
- RF-92 (P0) Aviso permanente de **protótipo/simulação** nas telas de envio.
- RF-93 (P1) Estado dos filtros na URL (query) para compartilhar visões.

## 7. Requisitos não funcionais

- RNF-01 **Componentização**: primitivos `Base*` genéricos; componentes de módulo isolados; nenhuma view > ~250 linhas sem extrair componentes.
- RNF-09 **Idioma do código**: identificadores em inglês; português só na UI e nos docblocks; nomes do planejamento/DW preservados (ver `AGENTS.md`).
- RNF-02 **Camadas**: view → composable/store → `services/` → `mocks/`; trocar mock por API só toca `services/`.
- RNF-03 **Tipagem estrita** (sem `any`), build limpo no `vue-tsc`.
- RNF-04 **Visual** conforme `docs/agents/DESIGN.md`; contraste AA; foco visível; navegação por teclado nos controles.
- RNF-05 **Responsivo** de 360px a 1440px+.
- RNF-06 **Reprodutível**: mocks determinísticos, "hoje" = 2026-10-28.
- RNF-07 **Privacidade**: nenhuma PII real; telefone/e-mail/documento sempre mascarados.
- RNF-08 **Performance**: listas de ~240 pessoas com paginação; chunks por rota (lazy).

## 8. Glossário

- **R, F, V**: recência (dias desde o último fornecimento), frequência (dias com fornecimento em 12 meses), valor (valor vendido em 12 meses, abatidas trocas/cancelamentos).
- **Nota/faixa**: síntese de R, F, V (1–5 cada) em 0–100 e faixa A–D. *Provisório.*
- **Segmento**: grupo derivado da nota e das tendências (Campeões, Fiéis, Promissores, Novos, Esfriando, Em risco, Hibernando, Perdidos). *Provisório.*
- **Pessoa**: entidade central (`pessoaId`, ULID). **Cadastro**: registro de origem (BKO fornecedor, BKO cliente, app, Central) que aponta para a pessoa. **Papel**: fornecedor ou cliente, definido no fato, não na pessoa.
- **Finalidade**: autenticação, transacional ou promocional. **Consentimento**: pessoa × finalidade × canal.
- **Holdout**: parcela do público elegível que deliberadamente **não** recebe, para medir o efeito da campanha. Nunca é enviado ao pr-notify.
- **Tratado**: braço que recebe a campanha.
- **Janela de 24h**: período após a última mensagem da pessoa em que a Central pode responder com texto livre; fora dele, só template aprovado.
- **Echo**: aviso de que o atendente respondeu pelo app; a automação sai da conversa.
- **Central**: dona do canal WhatsApp (números das lojas, conversas, opt-out do canal, custo). **pr-notify**: porta única de envio. **Motor**: decide o promocional.
- **Template**: mensagem pré-aprovada pela Meta; categoria marketing para promocional, utilidade para transacional.

## 9. Premissas e questões em aberto

Marcar na UI como "provisório" onde afetar o desenho.

1. **Regras de segmento e nota** não estão definidas (depende do gestor de CRM). O protótipo usa limiares de exemplo editáveis.
2. **O que "parar" bloqueia**: só promocional ou o canal inteiro? (Fluxos §10) — o protótipo mostra bloqueio promocional por padrão.
3. **Base legada**: só quem deu opt-in ou legítimo interesse? Muda o tamanho do público (JUR-03/I-13); o simulador mostra o efeito como parâmetro.
4. **Portfólio e titular Meta** (MTA-01..03) e **WABA única × por loja**: afetam submissão de templates; o protótipo assume WABA única.
5. **Holdout na Medição**: registrar data de corte ("teria recebido em…") por pessoa do holdout; a tela de campanha já exibe esse campo.
6. **Qual time é dono da aplicação** (GOV-05): fora do escopo do protótipo.
7. Valores de custo (ex.: ~US$ 0,0068 por resposta) são **ilustrativos**.

## 10. Roadmap

1. **Protótipo** (este PRD): fornecedores, dados mockados, sem envio.
2. Validação com gestor de CRM, lojas e jurídico; ajustar segmentos, templates e fluxos.
3. Extensão a **clientes** (papel `cliente`, rota `/clientes`) reaproveitando o módulo de pessoas.
4. **Backend real**: `services/` passa a chamar API da aplicação de relacionamento (leitura de `mart_crm`, pedidos ao pr-notify, Central).
5. Testes automatizados, autenticação, permissões por loja.

## 11. Critérios de aceite do protótipo

- Todas as rotas da seção 6 (itens P0) navegáveis, sem erro no console.
- `npm run typecheck` e `npm run build` limpos.
- Nenhuma requisição de rede para envio; "Simular envio" e o composer informam que é simulação.
- PII sempre mascarada; holdout nunca contado como enviado; opt-out visível como bloqueio com a camada.
- Visual reconhecível como Peça Rara conforme `docs/agents/DESIGN.md`.
- Componentes `Base*` reutilizados nas telas (sem estilos duplicados de botão, card, badge, tabela).
