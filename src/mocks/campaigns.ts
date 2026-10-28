import type { Campaign, CampaignStatus, Channel, RfvSegment } from '@/types'
import { isoDaysAgo, isoDaysAhead } from '@/utils/time'

interface Params {
  number: number
  name: string
  objective: string
  status: CampaignStatus
  channel: Channel
  templateId: string
  segment: RfvSegment
  shopIds: number[]
  eligible: number
  noConsent: number
  doNotContact: number
  noContact: number
  holdoutPercent: number
  startDaysAgo: number
  failPercent: number
  returns?: [number, number]
  unitCost: number
}

/**
 * Monta uma campanha coerente: público, funil e custo derivados dos parâmetros.
 *
 * @param p - Parâmetros resumidos da campanha.
 * @returns Campanha completa.
 */
function build(p: Params): Campaign {
  const fit = p.eligible - p.noConsent - p.doNotContact - p.noContact
  const holdout = Math.round(fit * (p.holdoutPercent / 100))
  const treated = fit - holdout
  const executed = p.status === 'running' || p.status === 'completed' || p.status === 'paused'
  const progress = p.status === 'running' ? 0.7 : p.status === 'paused' ? 0.4 : 1
  const requested = executed ? Math.round(treated * progress) : 0
  const failed = Math.round(requested * (p.failPercent / 100))
  const sent = requested - failed
  const delivered = Math.round(sent * 0.96)
  const read = Math.round(delivered * (p.channel === 'whatsapp' ? 0.78 : 0.42))
  const replies = Math.round(read * (p.channel === 'whatsapp' ? 0.34 : 0.1))
  const startAt = p.startDaysAgo >= 0 ? isoDaysAgo(p.startDaysAgo) : isoDaysAhead(-p.startDaysAgo)
  const number = String(p.number).padStart(6, '0')
  return {
    campaignId: `camp-${number}`,
    name: p.name,
    objective: p.objective,
    status: p.status,
    channel: p.channel,
    templateId: p.templateId,
    segment: p.segment,
    shopIds: p.shopIds,
    rules: {
      holdoutPercent: p.holdoutPercent,
      capPerPerson: 2,
      cooldownDays: 14,
      startAt,
      notAfter: new Date(new Date(startAt).getTime() + 5 * 86_400_000).toISOString(),
    },
    audience: { eligible: p.eligible, noConsent: p.noConsent, doNotContact: p.doNotContact, noContact: p.noContact, holdout, treated },
    funnel: { requested, sent, delivered, read, replies, failed },
    result: p.returns ? { treatedReturn: p.returns[0], holdoutReturn: p.returns[1] } : null,
    estimatedCost: Math.round(treated * p.unitCost * 100) / 100,
    actualCost: Math.round(delivered * p.unitCost * 100) / 100,
    keyPrefix: `rfv:camp-${number}`,
    holdoutCutoffDate: startAt,
    simulated: false,
    createdAt: isoDaysAgo(Math.max(p.startDaysAgo, 0) + 6),
  }
}

/** Campanhas fictícias em vários estados. */
export const CAMPAIGNS: Campaign[] = [
  build({ number: 126, name: 'Em risco · volte a fornecer', objective: 'Recuperar fornecedores frequentes que sumiram', status: 'running', channel: 'whatsapp', templateId: 'rfv.em_risco_marca', segment: 'at_risk', shopIds: [2, 3, 5], eligible: 34, noConsent: 9, doNotContact: 1, noContact: 2, holdoutPercent: 10, startDaysAgo: 3, failPercent: 4, unitCost: 0.35 }),
  build({ number: 125, name: 'Boas-vindas ao novo fornecedor', objective: 'Fazer o primeiro fornecimento virar o segundo', status: 'running', channel: 'whatsapp', templateId: 'rfv.novo_fornecedor_boas_vindas', segment: 'new', shopIds: [2, 3, 4, 5, 6], eligible: 28, noConsent: 6, doNotContact: 0, noContact: 1, holdoutPercent: 10, startDaysAgo: 8, failPercent: 3, unitCost: 0.35 }),
  build({ number: 121, name: 'Campeões · novidades da temporada', objective: 'Manter o ritmo de entrega dos melhores fornecedores', status: 'completed', channel: 'email', templateId: 'rfv.novidades_email', segment: 'champions', shopIds: [2, 3, 4, 5, 6, 8], eligible: 31, noConsent: 11, doNotContact: 1, noContact: 3, holdoutPercent: 15, startDaysAgo: 34, failPercent: 2, returns: [0.46, 0.38], unitCost: 0.02 }),
  build({ number: 118, name: 'Hibernando · sentimos sua falta', objective: 'Reengajar quem passou 4 a 8 meses sem fornecer', status: 'completed', channel: 'push', templateId: 'rfv.reengajamento_push', segment: 'hibernating', shopIds: [2, 3, 4, 5, 6, 8, 10], eligible: 29, noConsent: 12, doNotContact: 1, noContact: 5, holdoutPercent: 20, startDaysAgo: 62, failPercent: 6, returns: [0.18, 0.12], unitCost: 0.01 }),
  build({ number: 127, name: 'Esfriando · Black Friday', objective: 'Antecipar a entrega de peças para a Black Friday', status: 'scheduled', channel: 'whatsapp', templateId: 'rfv.em_risco_marca', segment: 'cooling', shopIds: [2, 3, 4, 5, 6], eligible: 33, noConsent: 10, doNotContact: 1, noContact: 2, holdoutPercent: 10, startDaysAgo: -4, failPercent: 0, unitCost: 0.35 }),
  build({ number: 124, name: 'Promissores · segunda entrega', objective: 'Estimular a segunda entrega em até 60 dias', status: 'paused', channel: 'whatsapp', templateId: 'rfv.novo_fornecedor_boas_vindas', segment: 'promising', shopIds: [3, 4], eligible: 22, noConsent: 8, doNotContact: 0, noContact: 1, holdoutPercent: 10, startDaysAgo: 12, failPercent: 5, unitCost: 0.35 }),
  build({ number: 128, name: 'Fiéis · programa de indicação', objective: 'Pedir indicação a fornecedores fiéis', status: 'draft', channel: 'email', templateId: 'rfv.novidades_email', segment: 'loyal', shopIds: [2, 3], eligible: 26, noConsent: 9, doNotContact: 1, noContact: 2, holdoutPercent: 10, startDaysAgo: -10, failPercent: 0, unitCost: 0.02 }),
]
