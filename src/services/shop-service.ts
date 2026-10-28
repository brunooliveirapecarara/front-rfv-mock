import type { Shop } from '@/types'
import { PEOPLE } from '@/mocks/people'
import { SHOPS } from '@/mocks/shops'
import { delay } from './latency'

/**
 * Lista lojas com a contagem de fornecedores ativos (últimos 12 meses).
 *
 * @returns Lojas fictícias.
 */
export async function listShops(): Promise<Shop[]> {
  await delay(250)
  return SHOPS.map((shop) => ({
    ...shop,
    activeSuppliers: PEOPLE.filter((p) => p.referenceShopId === shop.shopId && p.profile.daysSinceLastSupply <= 365).length,
  }))
}

/**
 * Nome de uma loja, de forma síncrona (dados estáticos).
 *
 * @param shopId - Id da loja.
 * @returns Nome da loja ou `—` se não existir.
 */
export function getShopName(shopId: number): string {
  return SHOPS.find((s) => s.shopId === shopId)?.name.replace('Peça Rara ', '') ?? '—'
}

/**
 * Opções de loja para selects (somente lojas ativas).
 *
 * @returns Lista de `{ value, label }`.
 */
export function getShopOptions(): { value: number; label: string }[] {
  return SHOPS.filter((s) => s.active).map((s) => ({ value: s.shopId, label: s.name }))
}
