# AGENTS.md — regras para agentes e contribuidores

Protótipo de frontend do **CRM de relacionamento da Peça Rara (RFV)**. Começa por **fornecedores**, mas o modelo é de **pessoa** (fornecedor e cliente são *papéis*), para depois cobrir clientes sem refazer a base. Todos os dados são **mockados**. Nada é enviado de verdade.

Leia antes de mexer: `docs/agents/PRD.md` (o quê), `docs/agents/DESIGN.md` (visual), `docs/artifacts/` (fontes de domínio: DW, frentes, fluxos).

## Stack

- Vue 3 (`<script setup lang="ts">`), Vite, TypeScript estrito.
- Tailwind CSS v4 (tokens em `@theme` no `src/assets/main.css`).
- Vue Router, Pinia, `lucide-vue-next` (ícones), Montserrat via `@fontsource-variable/montserrat`.
- Sem biblioteca de gráficos nem de componentes: gráficos são SVG/CSS próprios em `components/charts`.

## Comandos

```
npm run dev        # servidor de desenvolvimento
npm run typecheck  # vue-tsc --noEmit
npm run build      # typecheck + build de produção
```

Antes de encerrar qualquer tarefa: `npm run typecheck` e `npm run build` sem erros.

## Estrutura

```
src/
  assets/main.css        tokens Tailwind (@theme) e estilos globais
  router/                rotas (lazy por módulo)
  stores/                Pinia: só estado de UI/escopo (loja ativa, menu recolhido, rascunho de campanha)
  types/                 tipos de domínio (em inglês; DW citado nos docblocks)
  utils/                 funções puras: formatters, máscara de PII, regras RFV
  composables/           lógica reutilizável com reatividade (use-async-data.ts…)
  mocks/                 dados fictícios determinísticos (seed fixa)
  services/              ÚNICA porta de acesso a dados (async, com atraso simulado)
  components/
    ui/                  primitivos Base* (sem regra de negócio)
    domain/              componentes de domínio usados por mais de um módulo (SegmentBadge, WhatsappBubble…)
    layout/              AppShell, AppSidebar, AppTopbar
    charts/              gráficos SVG/CSS
  modules/<feature>/
    views/               páginas (ligadas ao router)
    components/          componentes só daquele módulo
```

Módulos: `dashboard`, `people`, `segments`, `campaigns`, `automations`, `templates`, `conversations`, `notifications`, `shops` (loja = `shop`, para não colidir com Pinia `stores/`).

## Regras de código

1. **Camadas**: view → composable/store → `services/` → `mocks/`. A view nunca importa de `mocks/`. Trocar mock por API real deve mexer só em `services/`.
2. **Componentização**: se um trecho se repete em 2+ lugares ou tem identidade própria, vira componente. `components/ui` não conhece o domínio (nada de "supplier" ou "campaign" ali); componentes de domínio ficam no módulo. Componente compartilhado entre módulos vai para `components/` com nome genérico.
3. **Props para baixo, eventos para cima**; `defineProps<…>()` e `defineEmits<…>()` tipados; `v-model` via `defineModel`. Sem mutar props.
4. **Lógica fora do template**: regras (nota RFV, segmento, elegibilidade, custo) ficam em `utils/` ou `services/` como funções puras e testáveis, não em componentes.
5. **Tipos**: sem `any`. Tipos de domínio em `src/types`, em inglês (`Person`, `personId`, `daysSinceLastSupply`). Os nomes do DW aparecem nos docblocks (`@see perfil_pessoa`) e como valores de enum que já existem no planejamento (ver "Idioma e nomenclatura").
6. **Estilo**: só tokens do tema (`bg-brand`, `bg-sand`, `text-ink`, `rounded-card`…). Proibido cor hex ou raio arbitrário solto em componente. Variações via props (`variant`, `size`, `tone`), não via classes copiadas.
7. **Acessibilidade**: elementos semânticos (`button`, `nav`, `table`), `aria-label` em botões só com ícone, foco visível, contraste conforme `docs/agents/DESIGN.md`.
8. **Responsivo**: mobile-first; a sidebar vira drawer com topbar; tabelas com rolagem horizontal ou cartões em telas estreitas.
9. **Idioma**: código em inglês; português só na UI e na descrição dos docblocks (ver "Idioma e nomenclatura").
10. **Datas e números**: `Intl` pt-BR via `utils/formatters`. "Hoje" nos mocks é fixo (`2026-10-28`) para o protótipo ser reprodutível.
11. **Documentação no código** (detalhes na seção "Comentários e docblocks"): sem comentários inline óbvios ou desnecessários; funções, composables, services e utils levam docblock objetivo.
12. **Nomes de arquivo**: ver "Idioma e nomenclatura".

## Idioma e nomenclatura

**Código em inglês**: arquivos, pastas, módulos, componentes, funções, variáveis, tipos, props, eventos, chaves de store, nomes de rota (`name`) e valores de enum criados por nós (`'draft'`, `'at_risk'`, `'delivered'`).

**Português somente em**:
- texto visível ao usuário (labels, títulos, mensagens, placeholders, `aria-label`), centralizado em `utils/labels.ts` quando for rótulo de enum;
- descrição dos docblocks;
- conteúdo dos mocks (nomes de pessoas, textos de mensagens, nomes de campanhas);
- caminho das URLs (`/fornecedores`, `/campanhas`), por ser parte da interface.

**Exceção: nomes que já existem no planejamento** (`docs/artifacts/dw-diagram.txt`, `docs/artifacts/Fluxos…`) mantêm o nome original, porque são contrato com o DW e os outros sistemas:
- tabelas, colunas e schemas (`perfil_pessoa`, `fato_mensagem`, `dim_cadastro`, `mart_crm`, `pessoa_id`), citados em docblocks, `@see` e strings de linhagem;
- valores de enum do DW: finalidade (`autenticacao`, `transacional`, `promocional`), modalidade (`consignacao`, `compra_pix`, `compra_credito`), origem do cadastro (`bko_fornecedor`, `bko_cliente`, `app_usuario`, `central_contato`), ids no formato `origem:id` (`bko_fornecedor:4521`);
- nomes de templates e eventos já definidos (`rfv.em_risco_marca`, `notification.requested`, `whatsapp.message.received`) e termos de produto (RFV, holdout, pr-notify, Central, Meta);
- campos de contrato do pr-notify (`idempotency_key`, `campaign_id`, `arm`, `not_after`) quando representarem o payload.

Os campos TypeScript, ainda assim, ficam em inglês e apontam o original no docblock (ex.: `personId` → `pessoa_id`).

**Glossário PT → código**: pessoa `Person`, fornecedor `Supplier`, cliente `Customer`, cadastro `Registration`, loja `Shop`, campanha `Campaign`, segmento `Segment`, público `Audience`, consentimento `Consent`, finalidade `Purpose` (valores do DW), envio `Delivery`, conversa `Conversation`, automação `Automation`, alerta `Alert`, nota `Score`, faixa `Grade`.

**Nomes de arquivo e pasta**:
- Arquivos `.vue`: iniciam com letra **maiúscula**, `PascalCase` (ex.: `SupplierNotification.vue`).
- Arquivos `.ts`: **minúsculos em kebab-case** (ex.: `supplier-notification.ts`, `use-async-data.ts`).
- Pastas: **minúsculas** (kebab-case se tiver mais de uma palavra).
- Os nomes acima são exemplos de padrão; não criar arquivo que não seja necessário.

## Comentários e docblocks

- **Evitar comentários inline** (`// ...`) e qualquer comentário que apenas repita o que o código já diz. O código deve se explicar por bons nomes.
- Inline só em exceção: o **porquê** não óbvio (regra de negócio, referência ao DW/fluxo, contorno de limitação). Uma linha.
- **Priorizar docblocks (JSDoc/TSDoc)** em funções, composables, services, utils, stores e funções expostas de componentes.
- Descrição **em português**, **objetiva e curta**: uma frase, no máximo duas. Sem narrativa, sem repetir o nome da função. O código (nomes, tipos, tags) continua em inglês.
- Incluir as tags que se aplicam, sem preencher o que não existe:
  - `@param nome - descrição` (um por parâmetro; omitir tipo, o TS já tem)
  - `@returns descrição` (omitir quando for `void`)
  - `@throws {Erro} quando…` (se a função lança ou rejeita)
  - `@example` só quando o uso não for evidente
  - `@see` para apontar ao trecho do DW/fluxo que fundamenta a regra
- Em `.vue`: documentar props/emits complexos com docblock no tipo da prop; componentes simples dispensam.
- Tipos e interfaces de domínio: docblock curto no tipo e nos campos que não são autoexplicativos (ex.: unidade, origem no DW).

```ts
/**
 * Classifica a pessoa em um segmento a partir das notas R, F e V.
 *
 * @param scores - Notas de 1 a 5 de recência, frequência e valor.
 * @returns Segmento correspondente; `lost` quando nenhuma regra casa.
 * @see docs/artifacts/dw-diagram.txt perfil_pessoa
 */
export function classifySegment(scores: RfvScores): RfvSegment { … }
```

## Regras de domínio que a UI precisa respeitar

Vêm de `docs/artifacts/Fluxos — motor, Central, pr-notify e Meta.md` e `docs/artifacts/dw-diagram.txt`.

- **Nada é enviado.** Toda ação de envio é simulação (dry-run) e deve dizer isso na tela. Não há chamada de rede real.
- **Pessoa é a entidade central.** Fornecedor e cliente são papéis; `dim_cadastro` é o registro de origem e aponta para a pessoa. Mostrar cadastros (por loja) dentro da ficha da pessoa.
- **Chaves**: o id da origem nunca é chave de UI; usar `personId` (ULID, `pessoa_id`), `registrationId` (`bko_fornecedor:4521`, `cadastro_id`), `shopId` (`loja_id`). Membros reservados (`nao_identificado`, `nao_se_aplica`) e cadastros técnicos não aparecem como pessoas.
- **PII**: nome pode aparecer; telefone, e-mail e documento sempre **mascarados** (`utils/mask`: `maskPhone`, `maskEmail`, `maskDocument`). Nunca exibir ou mockar documento real.
- **Opt-out é barrado em 3 lugares** (Campanhas filtram o público; pr-notify bloqueia por pessoa×finalidade; Central bloqueia o número no canal). A UI mostra quem foi excluído e por qual camada.
- **Holdout nunca sai da aplicação**: o braço de comparação é registrado, não enviado. Funil e custo contam só o braço tratado.
- **Um canal por pedido promocional, sem fallback.** Mudar de canal é nova decisão da campanha (outra chave de idempotência). Transacional é que tem fallback (e não é escopo da UI de campanhas).
- **Promocional exige template aprovado na categoria esperada** (marketing). Template com categoria divergente da finalidade aparece travado.
- **Janela de 24h** da Central: texto livre só dentro da janela; fora dela, só template. O echo do atendente desliga a automação naquela conversa.
- **R, F, V** vêm de `perfil_pessoa` (R = dias desde o último fornecimento; F = dias com fornecimento em 12m; V = valor vendido em 12m). Segmentos são derivados em `utils/rfv.ts` (`classifySegment`); as regras são provisórias até o gestor de CRM definir (ver `docs/agents/PRD.md`).
- **Escopo**: perfil existe por `rede` ou por `loja`; o filtro de escopo do header muda o que as telas mostram.

## O que NÃO fazer

- Não adicionar backend, autenticação, envio real, integração Meta ou biblioteca de UI/gráficos sem pedido explícito.
- Não criar componente de UI "mágico" que recebe objeto de domínio; passe valores simples.
- Não duplicar tokens, labels de enum ou formatadores: centralize (`utils/`, `types/`).
- Não mockar dados reais de pessoas, lojas ou documentos.

## Ao adicionar uma tela

1. Tipos em `types/` (se novos) → mock em `mocks/` → função em `services/`.
2. View em `modules/<feature>/views`, componentes específicos em `modules/<feature>/components`.
3. Rota em `router/` e item em `components/layout/navigation.ts` (se for navegação principal).
4. Reusar `components/ui` e `components/charts`; se faltar um primitivo, criá-lo lá, genérico.
5. Estados de carregamento, vazio e erro tratados (`EmptyState`, skeleton).
6. `npm run typecheck && npm run build`.
