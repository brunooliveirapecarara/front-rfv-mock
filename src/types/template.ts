import type { Channel, IsoDate, Purpose } from './common'

export type MetaCategory = 'marketing' | 'utility' | 'authentication'

/** Estado do template na análise da Meta; `category_mismatch` trava o uso. */
export type TemplateStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'category_mismatch'

/** Template de mensagem (autoria no pr-notify, submissão pela Central). */
export interface MessageTemplate {
  templateId: string
  name: string
  purpose: Purpose
  channel: Channel
  language: string
  expectedCategory: MetaCategory
  metaCategory: MetaCategory | null
  status: TemplateStatus
  version: number
  body: string
  buttons: string[]
  variables: string[]
  updatedAt: IsoDate
}
