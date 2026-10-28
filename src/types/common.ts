/** Canais de comunicação suportados. */
export type Channel = 'whatsapp' | 'email' | 'sms' | 'push'

/** Finalidade de uma mensagem (`dw.finalidade`). */
export type Purpose = 'autenticacao' | 'transacional' | 'promocional'

/** Papel da pessoa num fato; não é atributo da pessoa. */
export type Role = 'supplier' | 'customer'

/** Resultado paginado de uma listagem. */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** Opção de select/filtro. */
export interface Option<V = string> {
  value: V
  label: string
}

/** Data/hora em ISO 8601. */
export type IsoDate = string
