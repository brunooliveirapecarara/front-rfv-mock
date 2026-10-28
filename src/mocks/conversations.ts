import type { Conversation, ConversationMessage, ConversationStatus } from '@/types'
import { isoDaysAgo } from '@/utils/time'
import { PEOPLE } from './people'
import { createRng } from './seed'

type Scenario = 'campaign_button' | 'balance_after_hours' | 'agent_took_over' | 'closed' | 'deadline_question'

const SCENARIOS: Scenario[] = ['campaign_button', 'balance_after_hours', 'agent_took_over', 'campaign_button', 'deadline_question', 'closed', 'campaign_button', 'balance_after_hours', 'agent_took_over', 'deadline_question', 'closed', 'campaign_button']

/**
 * Monta as mensagens de um cenário, da mais antiga à mais recente.
 *
 * @param scenario - Tipo de conversa.
 * @param hoursSinceLast - Horas desde a última mensagem da pessoa.
 * @returns Mensagens em ordem cronológica.
 */
function messagesFor(scenario: Scenario, hoursSinceLast: number): ConversationMessage[] {
  const at = (extra: number) => isoDaysAgo(0, hoursSinceLast + extra)
  const campaign: ConversationMessage = { id: 'm1', author: 'campaign', text: 'Oi! Faz um tempo que não recebemos suas peças. Que tal renovar o armário e desapegar de novo?', sentAt: at(3), campaignId: 'camp-000126' }
  switch (scenario) {
    case 'campaign_button':
      return [
        campaign,
        { id: 'm2', author: 'supplier', text: 'Quero agendar entrega', button: 'Quero agendar entrega', sentAt: at(0) },
        { id: 'm3', author: 'automation', text: 'Perfeito! Qual dia da semana fica melhor para você trazer as peças?', sentAt: at(0) },
      ]
    case 'balance_after_hours':
      return [
        { id: 'm1', author: 'supplier', text: 'Boa noite, queria saber meu saldo de Moedas PR.', sentAt: at(0) },
        { id: 'm2', author: 'automation', text: 'Oi! Nosso atendimento volta amanhã às 9h. Deixe seu nome completo e retornamos.', sentAt: at(0) },
      ]
    case 'agent_took_over':
      return [
        { id: 'm1', author: 'supplier', text: 'Posso levar mais 20 peças amanhã sem agendar?', sentAt: at(1) },
        { id: 'm2', author: 'automation', text: 'Recebemos sua mensagem! Já vamos te responder.', sentAt: at(1) },
        { id: 'm3', author: 'agent', text: 'Oi! Pode sim, até 11h temos vaga na triagem.', sentAt: at(0) },
      ]
    case 'deadline_question':
      return [{ id: 'm1', author: 'supplier', text: 'Até quando posso retirar as peças devolvidas?', sentAt: at(0) }]
    case 'closed':
      return [
        campaign,
        { id: 'm2', author: 'supplier', text: 'Ver meu saldo', button: 'Ver meu saldo', sentAt: at(2) },
        { id: 'm3', author: 'agent', text: 'Seu saldo é de R$ 84,20. Qualquer dúvida, é só chamar!', sentAt: at(0) },
      ]
  }
}

/**
 * Gera conversas da Central a partir de fornecedores com contato de WhatsApp.
 *
 * @returns Conversas ordenadas da mais recente para a mais antiga.
 */
function generateConversations(): Conversation[] {
  const rng = createRng(9001)
  const candidates = PEOPLE.filter((p) => p.maskedPhone && !p.doNotContact)
  return SCENARIOS.map((scenario, i): Conversation => {
    const person = candidates[(i * 7 + 3) % candidates.length]!
    const closed = scenario === 'closed'
    const hours = closed ? rng.int(30, 120) : rng.int(1, 20)
    const messages = messagesFor(scenario, hours)
    const status: ConversationStatus = closed ? 'closed' : scenario === 'agent_took_over' ? 'waiting' : 'open'
    const lastFromPerson = [...messages].reverse().find((m) => m.author === 'supplier')
    return {
      conversationId: `conv-${String(i + 1).padStart(4, '0')}`,
      personId: person.personId,
      name: person.name,
      shopId: person.referenceShopId,
      status,
      unread: status === 'open' ? rng.int(1, 3) : 0,
      windowExpiresAt: !closed && lastFromPerson ? new Date(new Date(lastFromPerson.sentAt).getTime() + 24 * 3_600_000).toISOString() : null,
      automationPaused: scenario === 'agent_took_over',
      originCampaignId: messages.some((m) => m.campaignId) ? 'camp-000126' : null,
      messages,
    }
  }).sort((a, b) => (b.messages.at(-1)?.sentAt ?? '').localeCompare(a.messages.at(-1)?.sentAt ?? ''))
}

/** Conversas fictícias da Central. */
export const CONVERSATIONS: Conversation[] = generateConversations()
