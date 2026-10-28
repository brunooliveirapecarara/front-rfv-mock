import type { Channel, IsoDate, Purpose, Role } from './common'

/** Segmentos RFV derivados das notas (regras provisórias em `utils/rfv`). */
export type RfvSegment =
  | 'champions'
  | 'loyal'
  | 'promising'
  | 'new'
  | 'cooling'
  | 'at_risk'
  | 'hibernating'
  | 'lost'

/** Notas de 1 a 5 para recência, frequência e valor. */
export interface RfvScores {
  r: number
  f: number
  v: number
}

/** Notas, nota síntese (0–100), faixa e segmento. */
export interface RfvClassification extends RfvScores {
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  segment: RfvSegment
}

/** Modalidade de aquisição (`dw.modalidade`). */
export type Modality = 'consignacao' | 'compra_pix' | 'compra_credito'

/** Recorte de `perfil_pessoa` usado pela UI. */
export interface PersonProfile {
  firstSupplyDate: IsoDate
  lastSupplyDate: IsoDate
  /** R: dias desde o último fornecimento. */
  daysSinceLastSupply: number
  /** F: dias com fornecimento nos últimos 12 meses. */
  supplyDays12m: number
  supplyDays12mPrev: number
  /** V: valor vendido nos últimos 12 meses (R$). */
  soldValue12m: number
  soldValue12mPrev: number
  supplierValue12m: number
  monthsWithSupply12m: number
  suppliedProducts12m: number
  matureProducts: number
  matureProductsSold90d: number
  averageIntervalDays: number
  batches12m: number
  rejectedProducts12m: number
  returns12m: number
  /** Saldo de Moedas PR (`wallet.client_balances`). */
  prCoinsBalance: number
  cashbackBalance: number
  promotionalMessages90d: number
  lastMessageAt: IsoDate | null
  mainModality: Modality
  mainProductGroup: string
  purchasedValue12m: number
}

export type ConsentStatus = 'granted' | 'blocked' | 'no_record'

/** Uma célula do livro de consentimentos (`pr_notify.consents`). */
export interface Consent {
  channel: Channel
  purpose: Purpose
  status: ConsentStatus
  source: string | null
  occurredAt: IsoDate | null
}

/** Origem do cadastro (`dw.origem_cadastro`). */
export type RegistrationSource = 'bko_fornecedor' | 'bko_cliente' | 'app_usuario' | 'central_contato'

/** Registro de origem que aponta para a pessoa (`dim_cadastro`). */
export interface Registration {
  /** `cadastro_id`, no formato `origem:id`. */
  registrationId: string
  source: RegistrationSource
  shopId: number | null
  createdAt: IsoDate
}

/** Pessoa com perfil RFV; telefone, e-mail e documento sempre mascarados. */
export interface Person {
  /** `pessoa_id` (ULID). */
  personId: string
  name: string
  type: 'PF' | 'PJ'
  state: string
  ageRange: string
  firstSeenAt: IsoDate
  roles: Role[]
  referenceShopId: number
  shopIds: number[]
  profile: PersonProfile
  rfv: RfvClassification
  maskedPhone: string | null
  maskedEmail: string | null
  maskedDocument: string
  hasApp: boolean
  /** Pedido do titular: bloqueia todos os canais. */
  doNotContact: boolean
  consents: Consent[]
  registrations: Registration[]
}

export type TimelineEventType = 'batch' | 'sale' | 'return' | 'message' | 'conversation' | 'consent'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  date: IsoDate
}

/** Filtros da listagem de pessoas. */
export interface PersonFilters {
  role: Role
  search: string
  segment: RfvSegment | ''
  shopId: number | null
  grade: RfvClassification['grade'] | ''
  /** Contactável para promoção neste canal. */
  contactableChannel: Channel | ''
  hasApp: boolean | null
  r: number | null
  f: number | null
  sortBy: 'name' | 'r' | 'f' | 'v' | 'score'
  direction: 'asc' | 'desc'
  page: number
  pageSize: number
}
