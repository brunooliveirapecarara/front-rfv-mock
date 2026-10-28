import type { Channel, IsoDate } from './common'
import type { RfvSegment } from './person'

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'paused'

/** Contagens do funil do braço tratado. */
export interface CampaignFunnel {
  requested: number
  sent: number
  delivered: number
  read: number
  replies: number
  failed: number
}

/** Passo a passo do público, do elegível ao tratado. */
export interface CampaignAudience {
  eligible: number
  noConsent: number
  doNotContact: number
  noContact: number
  holdout: number
  treated: number
}

/** Retorno com peças em 30 dias, por braço (razão de 0 a 1). */
export interface CampaignResult {
  treatedReturn: number
  holdoutReturn: number
}

/** Regras de envio da campanha. */
export interface CampaignRules {
  holdoutPercent: number
  capPerPerson: number
  cooldownDays: number
  startAt: IsoDate
  /** Depois deste momento o pedido expira em vez de ser enviado (`not_after`). */
  notAfter: IsoDate
}

export interface Campaign {
  campaignId: string
  name: string
  objective: string
  status: CampaignStatus
  channel: Channel
  templateId: string
  segment: RfvSegment
  shopIds: number[]
  rules: CampaignRules
  audience: CampaignAudience
  funnel: CampaignFunnel
  result: CampaignResult | null
  estimatedCost: number
  actualCost: number
  /** Prefixo da chave de idempotência dos pedidos (`idempotency_key`). */
  keyPrefix: string
  /** Data de corte registrada para o holdout ("teria recebido em"). */
  holdoutCutoffDate: IsoDate
  simulated: boolean
  createdAt: IsoDate
}

/** Estado do wizard de nova campanha. */
export interface CampaignDraft {
  name: string
  objective: string
  segment: RfvSegment
  shopIds: number[]
  channel: Channel
  templateId: string
  holdoutPercent: number
  capPerPerson: number
  cooldownDays: number
  startAt: IsoDate
  notAfter: IsoDate
}

/** Resultado do simulador de alcance e custo. */
export interface CampaignSimulation extends CampaignAudience {
  costPerMessage: number
  estimatedCost: number
}
