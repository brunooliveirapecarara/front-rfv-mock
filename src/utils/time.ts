/** "Hoje" fixo do protótipo, para que os mocks sejam reprodutíveis. */
export const TODAY = new Date('2026-10-28T12:00:00-03:00')

const MS_PER_DAY = 86_400_000

/**
 * Data ISO a N dias antes de hoje.
 *
 * @param days - Dias para trás.
 * @param hours - Horas para trás, somadas aos dias.
 * @returns Data em ISO 8601.
 */
export function isoDaysAgo(days: number, hours = 0): string {
  return new Date(TODAY.getTime() - days * MS_PER_DAY - hours * 3_600_000).toISOString()
}

/**
 * Data ISO N dias após hoje.
 *
 * @param days - Dias para frente.
 * @returns Data em ISO 8601.
 */
export function isoDaysAhead(days: number): string {
  return new Date(TODAY.getTime() + days * MS_PER_DAY).toISOString()
}

/**
 * Diferença em dias inteiros entre hoje e uma data.
 *
 * @param iso - Data ISO.
 * @returns Dias desde a data (negativo se futura).
 */
export function daysSince(iso: string): number {
  return Math.floor((TODAY.getTime() - new Date(iso).getTime()) / MS_PER_DAY)
}
