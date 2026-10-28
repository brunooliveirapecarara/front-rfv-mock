const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

export interface Rng {
  /** Próximo número em [0, 1). */
  next: () => number
  /** Inteiro em [min, max]. */
  int: (min: number, max: number) => number
  /** Elemento aleatório da lista. */
  pick: <T>(list: readonly T[]) => T
  /** `true` com probabilidade `p`. */
  chance: (p: number) => boolean
  /** Identificador de 26 caracteres no estilo ULID. */
  ulid: () => string
}

/**
 * Gerador pseudoaleatório determinístico (mulberry32).
 *
 * @param seed - Semente inteira.
 * @returns Funções de sorteio reprodutíveis.
 */
export function createRng(seed: number): Rng {
  let state = seed >>> 0
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number): number => Math.floor(next() * (max - min + 1)) + min
  return {
    next,
    int,
    pick: <T>(list: readonly T[]): T => list[Math.floor(next() * list.length)] as T,
    chance: (p: number): boolean => next() < p,
    ulid: (): string => Array.from({ length: 26 }, () => CROCKFORD[int(0, 31)]).join(''),
  }
}

/**
 * Hash simples de texto para usar como semente.
 *
 * @param text - Texto de entrada.
 * @returns Inteiro sem sinal de 32 bits.
 */
export function hashText(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
