import type { RfvSegment, Tone } from '@/types'

export interface SegmentInfo {
  label: string
  description: string
  rule: string
  /** Cor para gráficos (variável CSS do tema). */
  color: string
  tone: Tone
}

/** Metadados dos segmentos, na ordem de exibição. */
export const SEGMENTS: Record<RfvSegment, SegmentInfo> = {
  champions: {
    label: 'Campeões',
    description: 'Fornecem sempre e vendem bem.',
    rule: 'R ≥ 4 e F ≥ 4',
    color: 'var(--color-brand-strong)',
    tone: 'brand',
  },
  loyal: {
    label: 'Fiéis',
    description: 'Recentes e com boa frequência.',
    rule: 'R ≥ 4 e F = 3',
    color: 'var(--color-teal)',
    tone: 'success',
  },
  promising: {
    label: 'Promissores',
    description: 'Fornecem há pouco, ainda com poucas entregas.',
    rule: 'R ≥ 4 e F ≤ 2',
    color: 'var(--color-info)',
    tone: 'info',
  },
  new: {
    label: 'Novos',
    description: 'Primeiro fornecimento nos últimos 90 dias.',
    rule: 'primeiro fornecimento ≤ 90 dias',
    color: '#8fc7cb',
    tone: 'info',
  },
  cooling: {
    label: 'Esfriando',
    description: 'Passaram do ritmo habitual; hora de reativar.',
    rule: 'R = 3',
    color: '#f0a43a',
    tone: 'warning',
  },
  at_risk: {
    label: 'Em risco',
    description: 'Eram frequentes e sumiram.',
    rule: 'R ≤ 2 e F ≥ 3',
    color: 'var(--color-coral)',
    tone: 'danger',
  },
  hibernating: {
    label: 'Hibernando',
    description: 'Pouca frequência e há tempo sem fornecer.',
    rule: 'R = 2 e F ≤ 2',
    color: '#b9a77a',
    tone: 'neutral',
  },
  lost: {
    label: 'Perdidos',
    description: 'Mais de 8 meses sem fornecer.',
    rule: 'R = 1',
    color: '#9a9a9a',
    tone: 'neutral',
  },
}

/** Segmentos na ordem de exibição. */
export const SEGMENT_ORDER = Object.keys(SEGMENTS) as RfvSegment[]
