import type { Automation } from '@/types'
import { AUTOMATIONS } from '@/mocks/automations'
import { delay } from './latency'

const automations: Automation[] = AUTOMATIONS.map((a) => ({ ...a }))

/**
 * Lista automações.
 *
 * @returns Automações em memória.
 */
export async function listAutomations(): Promise<Automation[]> {
  await delay(250)
  return automations.map((a) => ({ ...a }))
}

/**
 * Liga ou desliga uma automação.
 *
 * @param automationId - Id da automação.
 * @param active - Novo estado.
 * @returns Automação atualizada.
 * @throws {Error} Quando a automação não existe.
 */
export async function setAutomationActive(automationId: string, active: boolean): Promise<Automation> {
  await delay(400)
  const automation = automations.find((a) => a.automationId === automationId)
  if (!automation) throw new Error('Automação não encontrada.')
  automation.active = active
  return { ...automation }
}
