import type { Alert, Campaign } from '@/types'
import { PEOPLE } from '@/mocks/people'
import { delay } from './latency'
import { isContactable } from '@/utils/consent'
import { listAlerts } from './notification-service'
import { listCampaigns } from './campaign-service'

export interface DashboardKpis {
  activeSuppliers: number
  newSuppliers: number
  atRisk: number
  soldValue12m: number
  contactablePercent: number
}

export interface MonthlyPoint {
  label: string
  active: number
  newcomers: number
}

export interface DashboardData {
  kpis: DashboardKpis
  monthly: MonthlyPoint[]
  runningCampaigns: Campaign[]
  alerts: Alert[]
}

const MONTHS = ['mai', 'jun', 'jul', 'ago', 'set', 'out']

/**
 * Reúne os indicadores do painel para o escopo.
 *
 * @param shopId - Loja do escopo; `null` para a rede toda.
 * @returns KPIs, evolução mensal fictícia, campanhas em execução e alertas recentes.
 */
export async function getDashboard(shopId: number | null): Promise<DashboardData> {
  await delay(350)
  const people = PEOPLE.filter((p) => p.roles.includes('supplier') && (shopId === null || p.shopIds.includes(shopId)))
  const active = people.filter((p) => p.profile.daysSinceLastSupply <= 365)
  const total = active.length || 1
  const contactable = active.filter((p) => isContactable(p, 'whatsapp') || isContactable(p, 'email')).length
  const base = active.length
  const monthly = MONTHS.map((label, i) => ({
    label,
    active: Math.round(base * (0.82 + i * 0.036)),
    newcomers: Math.round(base * (0.05 + ((i * 7) % 4) * 0.012)),
  }))
  const [campaigns, alerts] = await Promise.all([listCampaigns(), listAlerts()])
  return {
    kpis: {
      activeSuppliers: active.length,
      newSuppliers: people.filter((p) => p.rfv.segment === 'new').length,
      atRisk: people.filter((p) => p.rfv.segment === 'at_risk').length,
      soldValue12m: Math.round(active.reduce((sum, p) => sum + p.profile.soldValue12m, 0)),
      contactablePercent: contactable / total,
    },
    monthly,
    runningCampaigns: campaigns.filter((c) => c.status === 'running'),
    alerts: alerts.filter((a) => !a.read).slice(0, 4),
  }
}
