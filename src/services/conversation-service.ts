import type { Conversation, ConversationMessage } from '@/types'
import { CONVERSATIONS } from '@/mocks/conversations'
import { TODAY } from '@/utils/time'
import { delay } from './latency'

const conversations: Conversation[] = CONVERSATIONS.map((c) => ({ ...c, messages: [...c.messages] }))

/**
 * Lista conversas da Central.
 *
 * @returns Conversas da mais recente para a mais antiga.
 */
export async function listConversations(): Promise<Conversation[]> {
  await delay(250)
  return conversations.map((c) => ({ ...c, messages: [...c.messages] }))
}

/**
 * Marca a conversa como lida.
 *
 * @param conversationId - Id da conversa.
 */
export async function markAsRead(conversationId: string): Promise<void> {
  const conversation = conversations.find((c) => c.conversationId === conversationId)
  if (conversation) conversation.unread = 0
}

/**
 * Simula a resposta do atendente; nada é enviado de verdade.
 *
 * @param conversationId - Id da conversa.
 * @param text - Texto livre ou nome do template.
 * @returns Mensagem registrada.
 * @throws {Error} Quando a conversa não existe.
 */
export async function simulateReply(conversationId: string, text: string): Promise<ConversationMessage> {
  await delay(500)
  const conversation = conversations.find((c) => c.conversationId === conversationId)
  if (!conversation) throw new Error('Conversa não encontrada.')
  const message: ConversationMessage = { id: `sim-${conversation.messages.length + 1}`, author: 'agent', text, sentAt: TODAY.toISOString() }
  conversation.messages.push(message)
  conversation.status = 'waiting'
  return message
}
