import type { Tone } from '@/types'

export interface ToneClasses {
  /** Fundo suave com texto legível (badges, alertas). */
  soft: string
  /** Cor de ênfase para ícones e pontos. */
  accent: string
  border: string
}

/** Classes Tailwind por tom semântico. */
export const TONE_CLASSES: Record<Tone, ToneClasses> = {
  neutral: { soft: 'bg-sand text-ink', accent: 'text-ink-muted', border: 'border-line' },
  brand: { soft: 'bg-brand text-ink', accent: 'text-brand-strong', border: 'border-brand' },
  success: { soft: 'bg-teal-soft text-teal-ink', accent: 'text-teal', border: 'border-teal' },
  danger: { soft: 'bg-coral-soft text-coral-ink', accent: 'text-coral', border: 'border-coral' },
  warning: { soft: 'bg-brand-soft text-warning-ink', accent: 'text-brand-strong', border: 'border-brand-strong' },
  info: { soft: 'bg-info-soft text-info-ink', accent: 'text-info', border: 'border-info' },
}
