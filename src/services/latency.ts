/**
 * Simula a latência de uma API para exibir estados de carregamento.
 *
 * @param ms - Atraso em milissegundos.
 * @returns Promise resolvida após o atraso.
 */
export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
