import type { IsoDate } from './common'

export type ConversationStatus = 'open' | 'waiting' | 'closed'

export type MessageAuthor = 'supplier' | 'agent' | 'automation' | 'campaign'

export interface ConversationMessage {
  id: string
  author: MessageAuthor
  text: string
  sentAt: IsoDate
  /** Botão do template clicado pela pessoa. */
  button?: string
  campaignId?: string
}

/** Conversa da Central (WhatsApp). */
export interface Conversation {
  conversationId: string
  personId: string
  name: string
  shopId: number
  status: ConversationStatus
  unread: number
  /** Fim da janela de 24h; `null` quando a janela está fechada. */
  windowExpiresAt: IsoDate | null
  /** Atendente respondeu pelo app (echo): automação pausada. */
  automationPaused: boolean
  originCampaignId: string | null
  messages: ConversationMessage[]
}
