import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getShopOptions } from '@/services/shop-service'

/** Escopo global: rede toda ou uma loja (`perfil_pessoa.escopo`). */
export const useScopeStore = defineStore('scope', () => {
  const shopId = ref<number | null>(null)
  const label = computed(() => getShopOptions().find((s) => s.value === shopId.value)?.label ?? 'Rede toda')

  /**
   * Define a loja do escopo.
   *
   * @param id - Id da loja; `null` para a rede toda.
   */
  function setShop(id: number | null): void {
    shopId.value = id
  }

  return { shopId, label, setShop }
})
