/**
 * Mascara um telefone brasileiro.
 *
 * @param digits - Telefone só com dígitos (DDD + número).
 * @returns Ex.: `(11) 9****-4321`.
 */
export function maskPhone(digits: string): string {
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)}****-${digits.slice(-4)}`
}

/**
 * Mascara um e-mail mantendo as duas primeiras letras e o domínio.
 *
 * @param email - E-mail completo.
 * @returns Ex.: `ma***@gmail.com`.
 */
export function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@')
  return `${local.slice(0, 2)}***@${domain}`
}

/**
 * Mascara um CPF mostrando apenas o miolo.
 *
 * @param digits - CPF só com dígitos.
 * @returns Ex.: `***.456.789-**`.
 */
export function maskDocument(digits: string): string {
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`
}
