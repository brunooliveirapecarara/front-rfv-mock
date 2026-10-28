import type { Alert, BlockLayer, Channel, Delivery, DeliveryStatus } from '@/types'
import { isoDaysAgo } from '@/utils/time'
import { CAMPAIGNS } from './campaigns'
import { PEOPLE } from './people'
import { createRng } from './seed'

const DELIVERY_COST: Record<Channel, number> = { whatsapp: 0.35, email: 0.02, push: 0.01, sms: 0.12 }
const PROVIDERS: Record<Channel, string> = { whatsapp: 'central', email: 'provedor-email', push: 'onesignal', sms: 'zenvia' }

/**
 * Gera o log de envios no formato de `fato_mensagem`.
 *
 * @returns Envios dos últimos 10 dias, do mais recente ao mais antigo.
 */
function generateDeliveries(): Delivery[] {
  const rng = createRng(4242)
  const executed = CAMPAIGNS.filter((c) => c.funnel.requested > 0)
  const deliveries = Array.from({ length: 180 }, (_, i): Delivery => {
    const person = rng.pick(PEOPLE)
    const campaign = rng.chance(0.7) ? rng.pick(executed) : null
    const channel: Channel = campaign ? campaign.channel : rng.pick(['whatsapp', 'whatsapp', 'email'] as const)
    const template = campaign ? campaign.templateId : rng.pick(['fornecedor.recebimento', 'fornecedor.devolucao_prazo'])
    const roll = rng.next()
    let status: DeliveryStatus = roll < 0.4 ? 'read' : roll < 0.82 ? 'delivered' : roll < 0.9 ? 'sent' : roll < 0.94 ? 'failed' : roll < 0.98 ? 'blocked_opt_out' : 'expired'
    if (rng.chance(0.03)) status = 'queued'
    const blocked = status === 'blocked_opt_out'
    const layer: BlockLayer | null = blocked ? rng.pick(['campaigns', 'pr_notify', 'central'] as const) : null
    const delivered = status === 'delivered' || status === 'read'
    return {
      deliveryId: `pr_notify_notification:${1870000 - i * 13}`,
      idempotencyKey: campaign ? `${campaign.keyPrefix}:person:${person.personId}` : `bko:evento:${rng.int(100000, 999999)}`,
      createdAt: isoDaysAgo(0, rng.int(0, 240)),
      personId: person.personId,
      name: person.name,
      shopId: person.referenceShopId,
      channel,
      template,
      purpose: campaign ? 'promocional' : 'transacional',
      sourceSystem: campaign ? 'rfv-campanhas' : rng.pick(['bko-phoenix', 'pinoquio-api'] as const),
      status,
      provider: PROVIDERS[channel],
      campaignId: campaign?.campaignId ?? null,
      arm: campaign ? 'treated' : null,
      cost: delivered ? DELIVERY_COST[channel] : 0,
      reason: status === 'failed' ? rng.pick(['Número sem WhatsApp', 'Template pausado pela Meta', 'Central sem resposta', 'E-mail com bounce']) : status === 'expired' ? 'Passou de not_after antes do envio' : blocked ? 'Pessoa em opt-out no canal' : null,
      blockLayer: layer,
    }
  })
  return deliveries.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** Log de envios fictício. */
export const DELIVERIES: Delivery[] = generateDeliveries()

/** Alertas fictícios do sistema. */
export const ALERTS: Alert[] = [
  { alertId: 'al-01', severity: 'critical', title: 'Qualidade do número em queda · Rio de Janeiro', description: 'A qualidade do número da loja RIO passou para baixa. Novos envios promocionais estão limitados.', createdAt: isoDaysAgo(0, 3), read: false, link: '/lojas' },
  { alertId: 'al-02', severity: 'warning', title: 'Template travado por categoria divergente', description: 'rfv.campanha_marca_premium foi aprovado como utilidade, mas a finalidade é promocional.', createdAt: isoDaysAgo(0, 9), read: false, link: '/templates' },
  { alertId: 'al-03', severity: 'warning', title: 'Template rejeitado pela Meta', description: 'rfv.saldo_cashback foi rejeitado. Revise o texto e submeta de novo.', createdAt: isoDaysAgo(1), read: false, link: '/templates' },
  { alertId: 'al-04', severity: 'info', title: '12 opt-outs registrados nas últimas 24h', description: 'Bloqueio aplicado no canal e gravado no livro de consentimentos.', createdAt: isoDaysAgo(1, 2), read: true },
  { alertId: 'al-05', severity: 'critical', title: 'Central recusou 3 envios transacionais', description: 'O pr-notify acionou o fallback por e-mail. Verifique a disponibilidade da Central.', createdAt: isoDaysAgo(2), read: true },
  { alertId: 'al-06', severity: 'info', title: 'Campanha concluída: Campeões · novidades da temporada', description: 'Retorno de 46% no braço tratado contra 38% no holdout.', createdAt: isoDaysAgo(3), read: true, link: '/campanhas/camp-000121' },
  { alertId: 'al-07', severity: 'warning', title: 'Número de loja pendente de conexão', description: 'Porto Alegre e Recife aguardam o onboarding do número na Central.', createdAt: isoDaysAgo(4), read: true, link: '/lojas' },
]
