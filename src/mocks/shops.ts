import type { Shop } from '@/types'

type Base = Omit<Shop, 'activeSuppliers'>

const BASE_SHOPS: Base[] = [
  { shopId: 2, code: 'CPS', name: 'Peça Rara Campinas', city: 'Campinas', state: 'SP', active: true, weeklyTriageCapacity: 220, number: { status: 'connected', quality: 'high', coexistence: true }, messages30d: 1840, cost30d: 412.6 },
  { shopId: 3, code: 'SPO', name: 'Peça Rara São Paulo', city: 'São Paulo', state: 'SP', active: true, weeklyTriageCapacity: 300, number: { status: 'connected', quality: 'high', coexistence: true }, messages30d: 2610, cost30d: 588.9 },
  { shopId: 4, code: 'CWB', name: 'Peça Rara Curitiba', city: 'Curitiba', state: 'PR', active: true, weeklyTriageCapacity: 180, number: { status: 'connected', quality: 'medium', coexistence: true }, messages30d: 1215, cost30d: 270.4 },
  { shopId: 5, code: 'BHZ', name: 'Peça Rara Belo Horizonte', city: 'Belo Horizonte', state: 'MG', active: true, weeklyTriageCapacity: 200, number: { status: 'connected', quality: 'high', coexistence: true }, messages30d: 1490, cost30d: 333.1 },
  { shopId: 6, code: 'RIO', name: 'Peça Rara Rio de Janeiro', city: 'Rio de Janeiro', state: 'RJ', active: true, weeklyTriageCapacity: 260, number: { status: 'connected', quality: 'low', coexistence: true }, messages30d: 1720, cost30d: 391.7 },
  { shopId: 7, code: 'POA', name: 'Peça Rara Porto Alegre', city: 'Porto Alegre', state: 'RS', active: true, weeklyTriageCapacity: 150, number: { status: 'pending', quality: null, coexistence: false }, messages30d: 0, cost30d: 0 },
  { shopId: 8, code: 'BSB', name: 'Peça Rara Brasília', city: 'Brasília', state: 'DF', active: true, weeklyTriageCapacity: 170, number: { status: 'connected', quality: 'high', coexistence: true }, messages30d: 980, cost30d: 214.2 },
  { shopId: 9, code: 'GYN', name: 'Peça Rara Goiânia', city: 'Goiânia', state: 'GO', active: true, weeklyTriageCapacity: 140, number: { status: 'not_connected', quality: null, coexistence: false }, messages30d: 0, cost30d: 0 },
  { shopId: 10, code: 'SSA', name: 'Peça Rara Salvador', city: 'Salvador', state: 'BA', active: true, weeklyTriageCapacity: 160, number: { status: 'connected', quality: 'medium', coexistence: true }, messages30d: 760, cost30d: 168.3 },
  { shopId: 11, code: 'REC', name: 'Peça Rara Recife', city: 'Recife', state: 'PE', active: true, weeklyTriageCapacity: 150, number: { status: 'pending', quality: null, coexistence: false }, messages30d: 0, cost30d: 0 },
  { shopId: 12, code: 'FLN', name: 'Peça Rara Florianópolis', city: 'Florianópolis', state: 'SC', active: true, weeklyTriageCapacity: 130, number: { status: 'connected', quality: 'high', coexistence: true }, messages30d: 640, cost30d: 141.5 },
  { shopId: 13, code: 'FOR', name: 'Peça Rara Fortaleza', city: 'Fortaleza', state: 'CE', active: false, weeklyTriageCapacity: 0, number: { status: 'not_connected', quality: null, coexistence: false }, messages30d: 0, cost30d: 0 },
]

/** Lojas fictícias; `activeSuppliers` é calculado em `shop-service`. */
export const SHOPS: Shop[] = BASE_SHOPS.map((s) => ({ ...s, activeSuppliers: 0 }))

/** Ids das lojas ativas, usados para distribuir pessoas. */
export const ACTIVE_SHOP_IDS: number[] = SHOPS.filter((s) => s.active).map((s) => s.shopId)
