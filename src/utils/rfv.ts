import type { PersonProfile, RfvClassification, RfvScores, RfvSegment } from '@/types'
import { daysSince } from './time'

/**
 * Limiares provisórios de pontuação, até o gestor de CRM definir as regras.
 * Recência: dias máximos para nota 5..2. Frequência e valor: mínimos para nota 5..2.
 */
export const RFV_THRESHOLDS = {
  recency: [30, 60, 120, 240],
  frequency: [12, 8, 4, 2],
  value: [5000, 2000, 800, 300],
} as const

/**
 * Converte um valor em nota de 1 a 5 comparando com limiares.
 *
 * @param value - Valor medido.
 * @param thresholds - Quatro limiares, da nota 5 para a 2.
 * @param lowerIsBetter - `true` quando valores menores são melhores (recência).
 * @returns Nota de 1 a 5.
 */
function pointsFor(value: number, thresholds: readonly number[], lowerIsBetter: boolean): number {
  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i] as number
    if (lowerIsBetter ? value <= threshold : value >= threshold) return 5 - i
  }
  return 1
}

/**
 * Calcula as notas R, F e V de um perfil.
 *
 * @param profile - Perfil da pessoa.
 * @returns Notas de 1 a 5.
 */
export function calculateScores(profile: PersonProfile): RfvScores {
  return {
    r: pointsFor(profile.daysSinceLastSupply, RFV_THRESHOLDS.recency, true),
    f: pointsFor(profile.supplyDays12m, RFV_THRESHOLDS.frequency, false),
    v: pointsFor(profile.soldValue12m, RFV_THRESHOLDS.value, false),
  }
}

/**
 * Sintetiza as notas em 0–100.
 *
 * @param scores - Notas R, F e V.
 * @returns Nota de 20 a 100.
 */
export function calculateScore({ r, f, v }: RfvScores): number {
  return Math.round(((r + f + v) / 15) * 100)
}

/**
 * Faixa (A–D) a partir da nota síntese.
 *
 * @param score - Nota de 0 a 100.
 * @returns Faixa A (≥80), B (≥60), C (≥40) ou D.
 */
export function gradeFromScore(score: number): RfvClassification['grade'] {
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'
  return 'D'
}

/**
 * Classifica a pessoa em um segmento.
 *
 * @param scores - Notas R, F e V.
 * @param daysSinceFirstSupply - Dias desde o primeiro fornecimento.
 * @returns Segmento; `lost` quando nenhuma regra anterior casa.
 */
export function classifySegment(scores: RfvScores, daysSinceFirstSupply: number): RfvSegment {
  const { r, f } = scores
  if (daysSinceFirstSupply <= 90) return 'new'
  if (r >= 4 && f >= 4) return 'champions'
  if (r >= 4 && f >= 3) return 'loyal'
  if (r >= 4) return 'promising'
  if (r === 3) return 'cooling'
  if (r <= 2 && f >= 3) return 'at_risk'
  if (r === 2) return 'hibernating'
  return 'lost'
}

/**
 * Classificação completa de um perfil.
 *
 * @param profile - Perfil da pessoa.
 * @returns Notas, nota síntese, faixa e segmento.
 */
export function classifyProfile(profile: PersonProfile): RfvClassification {
  const scores = calculateScores(profile)
  const score = calculateScore(scores)
  return {
    ...scores,
    score,
    grade: gradeFromScore(score),
    segment: classifySegment(scores, daysSince(profile.firstSupplyDate)),
  }
}
