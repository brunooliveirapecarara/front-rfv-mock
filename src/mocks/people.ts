import type {
  Channel,
  Consent,
  ConsentStatus,
  Person,
  PersonProfile,
  Registration,
  Role,
} from '@/types'
import { maskDocument, maskEmail, maskPhone } from '@/utils/mask'
import { classifyProfile } from '@/utils/rfv'
import { isoDaysAgo } from '@/utils/time'
import { ACTIVE_SHOP_IDS } from './shops'
import { createRng, type Rng } from './seed'

const FIRST_NAMES = ['Ana', 'Beatriz', 'Camila', 'Daniela', 'Eduarda', 'Fernanda', 'Gabriela', 'Helena', 'Isabela', 'Juliana', 'Karina', 'Larissa', 'Mariana', 'Natália', 'Patrícia', 'Renata', 'Sabrina', 'Tatiane', 'Vanessa', 'Luciana', 'Carolina', 'Aline', 'Priscila', 'Roberta', 'Bruno', 'Carlos', 'Diego', 'Eduardo', 'Felipe', 'Gustavo', 'Henrique', 'Rafael', 'Thiago', 'Marcos']
const LAST_NAMES = ['Almeida', 'Barbosa', 'Cardoso', 'Dias', 'Esteves', 'Ferreira', 'Gomes', 'Lima', 'Machado', 'Nogueira', 'Oliveira', 'Pereira', 'Ribeiro', 'Santos', 'Teixeira', 'Vieira', 'Moreira', 'Araújo', 'Campos', 'Freitas', 'Rocha', 'Martins', 'Correia', 'Azevedo']
const EMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br']
const STATE_BY_SHOP: Record<number, string> = { 2: 'SP', 3: 'SP', 4: 'PR', 5: 'MG', 6: 'RJ', 7: 'RS', 8: 'DF', 9: 'GO', 10: 'BA', 11: 'PE', 12: 'SC' }
const PRODUCT_GROUPS = ['Vestuário feminino', 'Calçados', 'Bolsas e acessórios', 'Vestuário masculino', 'Infantil']
const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']

type Archetype = 'champion' | 'loyal' | 'promising' | 'newcomer' | 'cooling' | 'risk' | 'hibernating' | 'lost'

interface Range {
  weight: number
  r: [number, number]
  f: [number, number]
  v: [number, number]
}

const ARCHETYPES: Record<Archetype, Range> = {
  champion: { weight: 12, r: [3, 40], f: [12, 22], v: [5000, 9500] },
  loyal: { weight: 15, r: [10, 55], f: [4, 7], v: [1800, 4500] },
  promising: { weight: 11, r: [5, 50], f: [1, 3], v: [150, 700] },
  newcomer: { weight: 12, r: [5, 60], f: [1, 3], v: [100, 500] },
  cooling: { weight: 14, r: [70, 115], f: [2, 8], v: [300, 1800] },
  risk: { weight: 13, r: [130, 300], f: [4, 12], v: [900, 4000] },
  hibernating: { weight: 12, r: [130, 230], f: [1, 2], v: [80, 400] },
  lost: { weight: 11, r: [260, 700], f: [1, 3], v: [40, 300] },
}

/**
 * Sorteia um arquétipo respeitando os pesos.
 *
 * @param rng - Gerador determinístico.
 * @returns Chave do arquétipo.
 */
function pickArchetype(rng: Rng): Archetype {
  const keys = Object.keys(ARCHETYPES) as Archetype[]
  const total = keys.reduce((sum, k) => sum + ARCHETYPES[k].weight, 0)
  let target = rng.next() * total
  for (const key of keys) {
    target -= ARCHETYPES[key].weight
    if (target <= 0) return key
  }
  return 'lost'
}

/**
 * Monta o perfil de uma pessoa a partir do arquétipo.
 *
 * @param rng - Gerador determinístico.
 * @param archetype - Comportamento a simular.
 * @returns Perfil coerente com o arquétipo.
 */
function buildProfile(rng: Rng, archetype: Archetype): PersonProfile {
  const range = ARCHETYPES[archetype]
  const r = rng.int(...range.r)
  const f = rng.int(...range.f)
  const v = rng.int(...range.v)
  const daysSinceFirst = archetype === 'newcomer' ? rng.int(Math.max(r, 20), 85) : Math.max(r + 30, rng.int(120, 1500))
  const products = Math.max(1, Math.round(f * rng.int(3, 9)))
  const mature = Math.max(1, Math.round(products * 0.7))
  const sellThrough = 0.25 + rng.next() * 0.6
  const trend = archetype === 'champion' || archetype === 'loyal' ? 0.85 + rng.next() * 0.3 : 0.6 + rng.next() * 0.9
  const isBuyer = rng.chance(0.3)
  return {
    firstSupplyDate: isoDaysAgo(daysSinceFirst),
    lastSupplyDate: isoDaysAgo(r),
    daysSinceLastSupply: r,
    supplyDays12m: f,
    supplyDays12mPrev: Math.max(0, Math.round(f * (0.6 + rng.next() * 0.9))),
    soldValue12m: v,
    soldValue12mPrev: Math.round(v / trend),
    supplierValue12m: Math.round(v * 0.5),
    monthsWithSupply12m: Math.min(12, Math.max(1, Math.round(f * 0.6))),
    suppliedProducts12m: products,
    matureProducts: mature,
    matureProductsSold90d: Math.round(mature * sellThrough),
    averageIntervalDays: f > 1 ? Math.round(365 / f) : 0,
    batches12m: Math.max(1, Math.round(f * 0.8)),
    rejectedProducts12m: rng.int(0, Math.max(1, Math.round(products * 0.25))),
    returns12m: rng.chance(0.5) ? rng.int(0, 6) : 0,
    prCoinsBalance: rng.chance(0.35) ? rng.int(10, 600) : 0,
    cashbackBalance: rng.chance(0.25) ? rng.int(5, 250) : 0,
    promotionalMessages90d: rng.int(0, 5),
    lastMessageAt: rng.chance(0.8) ? isoDaysAgo(rng.int(1, 80)) : null,
    mainModality: rng.pick(['consignacao', 'consignacao', 'compra_pix', 'compra_credito'] as const),
    mainProductGroup: rng.pick(PRODUCT_GROUPS),
    purchasedValue12m: isBuyer ? rng.int(80, 1800) : 0,
  }
}

/**
 * Sorteia o status do consentimento de uma célula canal × finalidade.
 *
 * @param rng - Gerador determinístico.
 * @param channel - Canal da célula.
 * @param promotional - `true` para finalidade promocional.
 * @param available - `false` quando a pessoa não tem o contato do canal.
 * @returns Status sorteado.
 */
function pickConsentStatus(rng: Rng, channel: Channel, promotional: boolean, available: boolean): ConsentStatus {
  if (!available) return 'no_record'
  if (!promotional) return rng.chance(0.92) ? 'granted' : 'no_record'
  if (channel === 'sms') return 'no_record'
  const p = rng.next()
  const granted = channel === 'whatsapp' ? 0.58 : channel === 'email' ? 0.45 : 0.6
  if (p < granted) return 'granted'
  return p < granted + 0.1 ? 'blocked' : 'no_record'
}

/**
 * Monta o livro de consentimentos da pessoa.
 *
 * @param rng - Gerador determinístico.
 * @param available - Canais em que a pessoa tem contato.
 * @param doNotContact - Pedido do titular: bloqueia tudo.
 * @returns Uma linha por canal × finalidade (transacional e promocional).
 */
function buildConsents(rng: Rng, available: Record<Channel, boolean>, doNotContact: boolean): Consent[] {
  const channels: Channel[] = ['whatsapp', 'email', 'sms', 'push']
  return channels.flatMap((channel) =>
    (['transacional', 'promocional'] as const).map((purpose): Consent => {
      const status = doNotContact ? 'blocked' : pickConsentStatus(rng, channel, purpose === 'promocional', available[channel])
      const recorded = status !== 'no_record'
      return {
        channel,
        purpose,
        status,
        source: !recorded ? null : doNotContact ? 'solicitação do titular' : purpose === 'transacional' ? 'romaneio' : rng.pick(['aceite no romaneio', 'app', 'resposta na Central']),
        occurredAt: recorded ? isoDaysAgo(rng.int(5, 600)) : null,
      }
    }),
  )
}

/**
 * Gera pessoas fictícias e determinísticas.
 *
 * @param count - Quantas pessoas criar.
 * @returns Pessoas com perfil RFV, consentimentos e cadastros.
 */
function generatePeople(count: number): Person[] {
  const rng = createRng(20261028)
  return Array.from({ length: count }, () => {
    const archetype = pickArchetype(rng)
    const profile = buildProfile(rng, archetype)
    const referenceShopId = rng.pick(ACTIVE_SHOP_IDS)
    const shopIds = rng.chance(0.15) ? [referenceShopId, rng.pick(ACTIVE_SHOP_IDS)].filter((id, i, a) => a.indexOf(id) === i) : [referenceShopId]
    const name = `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`
    const hasPhone = rng.chance(0.92)
    const hasEmail = rng.chance(0.7)
    const hasApp = rng.chance(0.66)
    const doNotContact = rng.chance(0.03)
    const roles: Role[] = profile.purchasedValue12m > 0 ? ['supplier', 'customer'] : ['supplier']
    const phoneDigits = `${rng.int(11, 89)}9${rng.int(10000000, 99999999)}`
    const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '.')
    const registrations: Registration[] = shopIds.map((shopId) => ({
      registrationId: `bko_fornecedor:${rng.int(1000, 760000)}`,
      source: 'bko_fornecedor',
      shopId,
      createdAt: profile.firstSupplyDate,
    }))
    if (hasApp) registrations.push({ registrationId: `app_usuario:${rng.int(1000, 282000)}`, source: 'app_usuario', shopId: null, createdAt: isoDaysAgo(rng.int(10, 900)) })
    if (roles.includes('customer')) registrations.push({ registrationId: `bko_cliente:${rng.int(1000, 793000)}`, source: 'bko_cliente', shopId: null, createdAt: profile.firstSupplyDate })
    return {
      personId: rng.ulid(),
      name,
      type: 'PF' as const,
      state: STATE_BY_SHOP[referenceShopId] ?? 'SP',
      ageRange: rng.pick(AGE_RANGES),
      firstSeenAt: profile.firstSupplyDate,
      roles,
      referenceShopId,
      shopIds,
      profile,
      rfv: classifyProfile(profile),
      maskedPhone: hasPhone ? maskPhone(phoneDigits) : null,
      maskedEmail: hasEmail ? maskEmail(`${slug}@${rng.pick(EMAIL_DOMAINS)}`) : null,
      maskedDocument: maskDocument(String(rng.int(100000000, 999999999))),
      hasApp,
      doNotContact,
      consents: buildConsents(rng, { whatsapp: hasPhone, sms: hasPhone, email: hasEmail, push: hasApp }, doNotContact),
      registrations,
    }
  })
}

/** Base de pessoas fictícias (~240). */
export const PEOPLE: Person[] = generatePeople(240)
