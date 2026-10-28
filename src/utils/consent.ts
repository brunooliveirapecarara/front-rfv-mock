import type { Channel, Consent, Person, Purpose } from '@/types'

/**
 * Busca a célula de consentimento de uma pessoa.
 *
 * @param person - Pessoa.
 * @param channel - Canal.
 * @param purpose - Finalidade.
 * @returns Consentimento ou `undefined` se não existir.
 */
export function findConsent(person: Person, channel: Channel, purpose: Purpose): Consent | undefined {
  return person.consents.find((c) => c.channel === channel && c.purpose === purpose)
}

/**
 * Indica se a pessoa tem contato válido no canal.
 *
 * @param person - Pessoa.
 * @param channel - Canal.
 * @returns `true` quando há telefone, e-mail ou app conforme o canal.
 */
export function hasContact(person: Person, channel: Channel): boolean {
  if (channel === 'email') return person.maskedEmail !== null
  if (channel === 'push') return person.hasApp
  return person.maskedPhone !== null
}

/**
 * Indica se a pessoa pode receber promoção no canal.
 *
 * @param person - Pessoa.
 * @param channel - Canal.
 * @returns `true` quando há contato, consentimento promocional concedido e sem pedido do titular.
 */
export function isContactable(person: Person, channel: Channel): boolean {
  if (person.doNotContact || !hasContact(person, channel)) return false
  return findConsent(person, channel, 'promocional')?.status === 'granted'
}
