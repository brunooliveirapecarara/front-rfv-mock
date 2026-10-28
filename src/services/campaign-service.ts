import type { Campaign, CampaignDraft, CampaignSimulation, CampaignStatus, Channel } from '@/types'
import { CAMPAIGNS } from '@/mocks/campaigns'
import { PEOPLE } from '@/mocks/people'
import { hasContact } from '@/utils/consent'
import { findConsent } from '@/utils/consent'
import { isoDaysAgo } from '@/utils/time'
import { delay } from './latency'

/** Campos do rascunho que afetam o alcance simulado. */
export type SimulationInput = Pick<CampaignDraft, 'segment' | 'shopIds' | 'channel' | 'holdoutPercent'>

/** Custo ilustrativo por mensagem entregue, por canal (R$). */
export const COST_PER_MESSAGE: Record<Channel, number> = { whatsapp: 0.35, email: 0.02, push: 0.01, sms: 0.12 }

const campaigns: Campaign[] = CAMPAIGNS.map((c) => ({ ...c }))

/**
 * Lista campanhas.
 *
 * @returns Campanhas, das mais recentes às mais antigas.
 */
export async function listCampaigns(): Promise<Campaign[]> {
  await delay(300)
  return campaigns.map((c) => ({ ...c })).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/**
 * Busca uma campanha.
 *
 * @param campaignId - Id da campanha.
 * @returns Campanha encontrada.
 * @throws {Error} Quando a campanha não existe.
 */
export async function getCampaign(campaignId: string): Promise<Campaign> {
  await delay(300)
  const campaign = campaigns.find((c) => c.campaignId === campaignId)
  if (!campaign) throw new Error('Campanha não encontrada.')
  return { ...campaign }
}

/**
 * Simula alcance, exclusões por camada e custo de um rascunho.
 *
 * @param draft - Campos do rascunho que definem público e canal.
 * @returns Público do elegível ao tratado e custo estimado.
 */
export async function simulateCampaign(draft: SimulationInput): Promise<CampaignSimulation> {
  await delay(450)
  const pool = PEOPLE.filter(
    (p) => p.roles.includes('supplier') && p.rfv.segment === draft.segment && (!draft.shopIds.length || p.shopIds.some((id) => draft.shopIds.includes(id))),
  )
  const doNotContact = pool.filter((p) => p.doNotContact).length
  const rest = pool.filter((p) => !p.doNotContact)
  const withContact = rest.filter((p) => hasContact(p, draft.channel))
  const fit = withContact.filter((p) => findConsent(p, draft.channel, 'promocional')?.status === 'granted').length
  const holdout = Math.round(fit * (draft.holdoutPercent / 100))
  const treated = fit - holdout
  const costPerMessage = COST_PER_MESSAGE[draft.channel]
  return {
    eligible: pool.length,
    doNotContact,
    noContact: rest.length - withContact.length,
    noConsent: withContact.length - fit,
    holdout,
    treated,
    costPerMessage,
    estimatedCost: Math.round(treated * costPerMessage * 100) / 100,
  }
}

/**
 * Registra a campanha como agendada em modo simulado; nada é enviado.
 *
 * @param draft - Rascunho validado.
 * @param simulation - Simulação correspondente.
 * @returns Campanha criada.
 */
export async function createSimulatedCampaign(draft: CampaignDraft, simulation: CampaignSimulation): Promise<Campaign> {
  await delay(700)
  const number = String(129 + campaigns.length - CAMPAIGNS.length).padStart(6, '0')
  const campaign: Campaign = {
    campaignId: `camp-${number}`,
    name: draft.name,
    objective: draft.objective,
    status: 'scheduled',
    channel: draft.channel,
    templateId: draft.templateId,
    segment: draft.segment,
    shopIds: draft.shopIds,
    rules: { holdoutPercent: draft.holdoutPercent, capPerPerson: draft.capPerPerson, cooldownDays: draft.cooldownDays, startAt: draft.startAt, notAfter: draft.notAfter },
    audience: { eligible: simulation.eligible, noConsent: simulation.noConsent, doNotContact: simulation.doNotContact, noContact: simulation.noContact, holdout: simulation.holdout, treated: simulation.treated },
    funnel: { requested: 0, sent: 0, delivered: 0, read: 0, replies: 0, failed: 0 },
    result: null,
    estimatedCost: simulation.estimatedCost,
    actualCost: 0,
    keyPrefix: `rfv:camp-${number}`,
    holdoutCutoffDate: draft.startAt,
    simulated: true,
    createdAt: isoDaysAgo(0),
  }
  campaigns.unshift(campaign)
  return { ...campaign }
}

/**
 * Altera o status de uma campanha (pausar/retomar).
 *
 * @param campaignId - Id da campanha.
 * @param status - Novo status.
 * @returns Campanha atualizada.
 * @throws {Error} Quando a campanha não existe.
 */
export async function setCampaignStatus(campaignId: string, status: CampaignStatus): Promise<Campaign> {
  await delay(400)
  const campaign = campaigns.find((c) => c.campaignId === campaignId)
  if (!campaign) throw new Error('Campanha não encontrada.')
  campaign.status = status
  return { ...campaign }
}
