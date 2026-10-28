import { TODAY } from './time'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const wholeCurrencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})
const numberFmt = new Intl.NumberFormat('pt-BR')

/** @param iso - Data ISO. @returns Data no formato dd/mm/aaaa. */
export const formatDate = (iso: string): string => dateFmt.format(new Date(iso))

/** @param iso - Data ISO. @returns Data e hora no formato dd/mm, hh:mm. */
export const formatDateTime = (iso: string): string => dateTimeFmt.format(new Date(iso))

/** @param iso - Data ISO. @returns Hora no formato hh:mm. */
export const formatTime = (iso: string): string => timeFmt.format(new Date(iso))

/** @param value - Valor em reais. @returns Valor em R$ com centavos. */
export const formatCurrency = (value: number): string => currencyFmt.format(value)

/** @param value - Valor em reais. @returns Valor em R$ sem centavos. */
export const formatWholeCurrency = (value: number): string => wholeCurrencyFmt.format(value)

/** @param value - Número. @returns Número com separador de milhar pt-BR. */
export const formatNumber = (value: number): string => numberFmt.format(value)

/**
 * Formata uma razão como percentual.
 *
 * @param ratio - Valor de 0 a 1.
 * @param digits - Casas decimais.
 * @returns Percentual, ex.: `42,5%`.
 */
export function formatPercent(ratio: number, digits = 0): string {
  return `${(ratio * 100).toFixed(digits).replace('.', ',')}%`
}

/**
 * Texto relativo a "hoje" do protótipo.
 *
 * @param iso - Data ISO.
 * @returns Ex.: `hoje`, `ontem`, `há 12 dias`, `há 3 meses`.
 */
export function relativeTime(iso: string): string {
  const days = Math.floor((TODAY.getTime() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 60) return `há ${days} dias`
  if (days < 730) return `há ${Math.round(days / 30)} meses`
  return `há ${Math.round(days / 365)} anos`
}

/**
 * Tempo restante até uma data, a partir de "hoje".
 *
 * @param iso - Data ISO futura.
 * @returns Ex.: `5h 20min`; `expirada` se já passou.
 */
export function timeRemaining(iso: string): string {
  const minutes = Math.floor((new Date(iso).getTime() - TODAY.getTime()) / 60_000)
  if (minutes <= 0) return 'expirada'
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`
}

/**
 * Iniciais de um nome.
 *
 * @param name - Nome completo.
 * @returns Até duas letras maiúsculas.
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}
