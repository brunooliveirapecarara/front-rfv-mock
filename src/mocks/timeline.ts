import type { Person, TimelineEvent } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { daysSince, isoDaysAgo } from '@/utils/time'
import { createRng, hashText } from './seed'

const PRODUCTS = ['Bolsa de couro', 'Vestido midi', 'Sandália salto', 'Camisa social', 'Jaqueta jeans', 'Tênis casual', 'Blazer', 'Saia plissada']
const TEMPLATES = ['rfv.em_risco_marca', 'rfv.novo_fornecedor_boas_vindas', 'rfv.volte_a_fornecer', 'fornecedor.recebimento']

/**
 * Gera a linha do tempo de uma pessoa, do evento mais recente ao mais antigo.
 * Determinística por `personId`.
 *
 * @param person - Pessoa de referência.
 * @returns Eventos de lotes, vendas, devoluções, mensagens e consentimentos.
 */
export function generateTimeline(person: Person): TimelineEvent[] {
  const rng = createRng(hashText(person.personId))
  const { profile } = person
  const events: TimelineEvent[] = []
  const limit = daysSince(profile.firstSupplyDate)
  const interval = Math.max(14, profile.averageIntervalDays || 60)

  const batches = Math.min(6, profile.batches12m)
  for (let i = 0; i < batches; i++) {
    const days = profile.daysSinceLastSupply + i * interval
    if (days > limit) break
    const quantity = rng.int(6, 40)
    events.push({
      id: `batch-${i}`,
      type: 'batch',
      title: `Lote R-${rng.int(100000, 454000)} entregue`,
      description: `${quantity} peças declaradas · ${Math.round(quantity * 0.8)} aceitas na triagem`,
      date: isoDaysAgo(days),
    })
  }

  const sales = Math.min(8, Math.round(profile.suppliedProducts12m / 4) + 1)
  for (let i = 0; i < sales; i++) {
    const days = rng.int(Math.max(1, profile.daysSinceLastSupply - 10), Math.min(limit, profile.daysSinceLastSupply + 200))
    events.push({
      id: `sale-${i}`,
      type: 'sale',
      title: `${rng.pick(PRODUCTS)} vendido`,
      description: `Venda de ${formatCurrency(rng.int(40, 420))} na loja de origem`,
      date: isoDaysAgo(days),
    })
  }

  if (profile.returns12m > 0) {
    events.push({
      id: 'return-0',
      type: 'return',
      title: 'Devolução por não venda comunicada',
      description: `${profile.returns12m} peças separadas · prazo de retirada de 30 dias`,
      date: isoDaysAgo(rng.int(5, 120)),
    })
  }

  for (let i = 0; i < Math.min(3, profile.promotionalMessages90d); i++) {
    events.push({
      id: `message-${i}`,
      type: 'message',
      title: `Mensagem ${rng.pick(['entregue', 'lida', 'entregue'])}`,
      description: `Template ${rng.pick(TEMPLATES)} por ${rng.pick(['WhatsApp', 'E-mail'])}`,
      date: isoDaysAgo(rng.int(1, 80)),
    })
  }

  person.consents
    .filter((c) => c.occurredAt && c.purpose === 'promocional')
    .slice(0, 2)
    .forEach((c, i) =>
      events.push({
        id: `consent-${i}`,
        type: 'consent',
        title: c.status === 'blocked' ? 'Opt-out registrado' : 'Consentimento concedido',
        description: `${c.channel} · promocional · origem: ${c.source ?? 'n/d'}`,
        date: c.occurredAt as string,
      }),
    )

  return events.sort((a, b) => b.date.localeCompare(a.date))
}
