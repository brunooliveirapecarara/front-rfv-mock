import type { Channel } from './common'
import type { RfvSegment } from './person'

/** Reativa responde a quem escreveu (Central); proativa nasce de decisão nossa (motor). */
export type AutomationKind = 'reactive' | 'proactive'

export interface Automation {
  automationId: string
  kind: AutomationKind
  name: string
  description: string
  trigger: string
  condition: string
  action: string
  channel: Channel
  template: string | null
  segment: RfvSegment | null
  /** Onde a automação mora e passa. */
  origin: 'central' | 'engine'
  active: boolean
  runs30d: number
  replyRate: number | null
  steps: string[]
  warning?: string
}
