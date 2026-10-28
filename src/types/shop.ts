/** Loja com o número da Central (`dim_loja` + canal). */
export interface Shop {
  /** `loja_id`. */
  shopId: number
  code: string
  name: string
  city: string
  state: string
  active: boolean
  activeSuppliers: number
  weeklyTriageCapacity: number
  number: {
    status: 'connected' | 'pending' | 'not_connected'
    quality: 'high' | 'medium' | 'low' | null
    /** Número operando no app e na API ao mesmo tempo. */
    coexistence: boolean
  }
  messages30d: number
  cost30d: number
}
