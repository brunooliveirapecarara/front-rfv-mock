import type { Channel, IsoDate, Purpose } from './common'

export type DeliveryStatus =
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'blocked_opt_out'
  | 'expired'

/** Camada que barrou o envio. */
export type BlockLayer = 'campaigns' | 'pr_notify' | 'central'

/** Pedido de envio por canal (`fato_mensagem`). */
export interface Delivery {
  /** `mensagem_id`. */
  deliveryId: string
  idempotencyKey: string
  createdAt: IsoDate
  personId: string
  name: string
  shopId: number
  channel: Channel
  template: string
  purpose: Purpose
  sourceSystem: 'rfv-campanhas' | 'bko-phoenix' | 'pinoquio-api' | 'wallet-api'
  status: DeliveryStatus
  provider: string
  campaignId: string | null
  arm: 'treated' | null
  cost: number
  reason: string | null
  blockLayer: BlockLayer | null
}

export type AlertSeverity = 'info' | 'warning' | 'critical'

/** Evento do sistema para o time de CRM e da rede. */
export interface Alert {
  alertId: string
  severity: AlertSeverity
  title: string
  description: string
  createdAt: IsoDate
  read: boolean
  link?: string
}

export interface DeliveryFilters {
  search: string
  channel: Channel | ''
  status: DeliveryStatus | ''
  purpose: Purpose | ''
  page: number
  pageSize: number
}
