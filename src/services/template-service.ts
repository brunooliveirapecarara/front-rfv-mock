import type { MessageTemplate, TemplateStatus } from '@/types'
import { TEMPLATES } from '@/mocks/templates'
import { delay } from './latency'

const templates: MessageTemplate[] = TEMPLATES.map((t) => ({ ...t }))

/**
 * Lista templates.
 *
 * @returns Templates em memória.
 */
export async function listTemplates(): Promise<MessageTemplate[]> {
  await delay(250)
  return templates.map((t) => ({ ...t }))
}

/**
 * Simula o envio de um rascunho para análise da Meta.
 *
 * @param templateId - Template em rascunho.
 * @returns Template atualizado com status `under_review`.
 * @throws {Error} Quando o template não existe ou não está em rascunho/rejeitado.
 */
export async function submitForReview(templateId: string): Promise<MessageTemplate> {
  await delay(500)
  const template = templates.find((t) => t.templateId === templateId)
  if (!template) throw new Error('Template não encontrado.')
  const allowed: TemplateStatus[] = ['draft', 'rejected']
  if (!allowed.includes(template.status)) throw new Error('Só rascunhos ou rejeitados podem ser reenviados.')
  template.status = 'under_review'
  template.version += 1
  return { ...template }
}
