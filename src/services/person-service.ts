import type { Channel, Paginated, Person, PersonFilters, RfvSegment, TimelineEvent } from '@/types'
import { generateTimeline } from '@/mocks/timeline'
import { PEOPLE } from '@/mocks/people'
import { isContactable } from '@/utils/consent'
import { SEGMENT_ORDER } from '@/utils/segments'
import { delay } from './latency'

const SORTERS: Record<PersonFilters['sortBy'], (p: Person) => string | number> = {
  name: (p) => p.name,
  r: (p) => p.profile.daysSinceLastSupply,
  f: (p) => p.profile.supplyDays12m,
  v: (p) => p.profile.soldValue12m,
  score: (p) => p.rfv.score,
}

/**
 * Filtra pessoas por papel, loja e busca (sem os demais filtros).
 *
 * @param shopId - Loja do escopo; `null` para a rede toda.
 * @returns Fornecedores visíveis no escopo.
 */
function inScope(shopId: number | null): Person[] {
  return PEOPLE.filter((p) => p.roles.includes('supplier') && (shopId === null || p.shopIds.includes(shopId)))
}

/**
 * Lista pessoas com filtros, ordenação e paginação.
 *
 * @param filters - Filtros da listagem.
 * @returns Página de pessoas e total filtrado.
 */
export async function listPeople(filters: PersonFilters): Promise<Paginated<Person>> {
  await delay()
  const term = filters.search.trim().toLowerCase()
  const filtered = PEOPLE.filter((p) => {
    if (!p.roles.includes(filters.role)) return false
    if (term && !p.name.toLowerCase().includes(term)) return false
    if (filters.segment && p.rfv.segment !== filters.segment) return false
    if (filters.shopId !== null && !p.shopIds.includes(filters.shopId)) return false
    if (filters.grade && p.rfv.grade !== filters.grade) return false
    if (filters.contactableChannel && !isContactable(p, filters.contactableChannel)) return false
    if (filters.hasApp !== null && p.hasApp !== filters.hasApp) return false
    if (filters.r !== null && p.rfv.r !== filters.r) return false
    if (filters.f !== null && p.rfv.f !== filters.f) return false
    return true
  })
  const sorter = SORTERS[filters.sortBy]
  const factor = filters.direction === 'asc' ? 1 : -1
  filtered.sort((a, b) => {
    const x = sorter(a)
    const y = sorter(b)
    return (typeof x === 'string' ? x.localeCompare(y as string) : x - (y as number)) * factor
  })
  const start = (filters.page - 1) * filters.pageSize
  return { items: filtered.slice(start, start + filters.pageSize), total: filtered.length, page: filters.page, pageSize: filters.pageSize }
}

/**
 * Busca uma pessoa pelo id.
 *
 * @param personId - Id da pessoa.
 * @returns Pessoa encontrada.
 * @throws {Error} Quando a pessoa não existe.
 */
export async function getPerson(personId: string): Promise<Person> {
  await delay()
  const person = PEOPLE.find((p) => p.personId === personId)
  if (!person) throw new Error('Pessoa não encontrada.')
  return person
}

/**
 * Linha do tempo de uma pessoa.
 *
 * @param personId - Id da pessoa.
 * @returns Eventos do mais recente ao mais antigo.
 * @throws {Error} Quando a pessoa não existe.
 */
export async function getTimeline(personId: string): Promise<TimelineEvent[]> {
  await delay(200)
  const person = PEOPLE.find((p) => p.personId === personId)
  if (!person) throw new Error('Pessoa não encontrada.')
  return generateTimeline(person)
}

/**
 * Conta fornecedores por segmento no escopo.
 *
 * @param shopId - Loja do escopo; `null` para a rede toda.
 * @returns Contagem por segmento, na ordem de exibição.
 */
export async function getSegmentCounts(shopId: number | null): Promise<Record<RfvSegment, number>> {
  await delay(250)
  const counts = Object.fromEntries(SEGMENT_ORDER.map((s) => [s, 0])) as Record<RfvSegment, number>
  for (const person of inScope(shopId)) counts[person.rfv.segment]++
  return counts
}

/**
 * Matriz R × F com a contagem de fornecedores em cada célula.
 *
 * @param shopId - Loja do escopo; `null` para a rede toda.
 * @returns Matriz 5×5: linhas R de 5 a 1, colunas F de 1 a 5.
 */
export async function getRfvMatrix(shopId: number | null): Promise<number[][]> {
  await delay(250)
  const matrix = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => 0))
  for (const person of inScope(shopId)) matrix[5 - person.rfv.r]![person.rfv.f - 1]!++
  return matrix
}

/**
 * Resumo de contactabilidade por canal no escopo.
 *
 * @param shopId - Loja do escopo; `null` para a rede toda.
 * @returns Total de fornecedores e quantos são contactáveis por canal.
 */
export async function getContactability(shopId: number | null): Promise<{ total: number; byChannel: Record<Channel, number> }> {
  await delay(250)
  const people = inScope(shopId)
  const byChannel = { whatsapp: 0, email: 0, sms: 0, push: 0 }
  for (const person of people) {
    for (const channel of Object.keys(byChannel) as Channel[]) if (isContactable(person, channel)) byChannel[channel]++
  }
  return { total: people.length, byChannel }
}
