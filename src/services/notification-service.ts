import type { Alert, Delivery, DeliveryFilters, Paginated } from '@/types'
import { ALERTS } from '@/mocks/notifications'
import { DELIVERIES } from '@/mocks/notifications'
import { delay } from './latency'

const alerts: Alert[] = ALERTS.map((a) => ({ ...a }))

/**
 * Lista envios com filtros e paginação.
 *
 * @param filters - Filtros do log.
 * @returns Página de envios.
 */
export async function listDeliveries(filters: DeliveryFilters): Promise<Paginated<Delivery>> {
  await delay(300)
  const term = filters.search.trim().toLowerCase()
  const filtered = DELIVERIES.filter((d) => {
    if (term && !d.name.toLowerCase().includes(term) && !d.template.toLowerCase().includes(term)) return false
    if (filters.channel && d.channel !== filters.channel) return false
    if (filters.status && d.status !== filters.status) return false
    if (filters.purpose && d.purpose !== filters.purpose) return false
    return true
  })
  const start = (filters.page - 1) * filters.pageSize
  return { items: filtered.slice(start, start + filters.pageSize), total: filtered.length, page: filters.page, pageSize: filters.pageSize }
}

/**
 * Resumo de envios por status.
 *
 * @returns Total e contagem por status.
 */
export async function getDeliverySummary(): Promise<Record<string, number>> {
  await delay(200)
  const summary: Record<string, number> = { total: DELIVERIES.length }
  for (const d of DELIVERIES) summary[d.status] = (summary[d.status] ?? 0) + 1
  return summary
}

/**
 * Lista alertas do sistema.
 *
 * @returns Alertas do mais recente ao mais antigo.
 */
export async function listAlerts(): Promise<Alert[]> {
  await delay(250)
  return alerts.map((a) => ({ ...a }))
}

/**
 * Marca alertas como lidos.
 *
 * @param alertIds - Ids a marcar; vazio marca todos.
 */
export async function markAlertsRead(alertIds: string[] = []): Promise<void> {
  await delay(200)
  for (const alert of alerts) if (!alertIds.length || alertIds.includes(alert.alertId)) alert.read = true
}

/**
 * Conta alertas não lidos.
 *
 * @returns Quantidade de alertas não lidos.
 */
export function countUnreadAlerts(): number {
  return alerts.filter((a) => !a.read).length
}
