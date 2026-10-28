import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'rfv:sidebar-collapsed'

/**
 * Lê a preferência de menu recolhido salva no navegador.
 *
 * @returns `true` se o menu estava recolhido; `false` se ausente ou inacessível.
 */
function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/** Estado de interface compartilhado: menu lateral recolhido (somente ícones). */
export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(readCollapsed())

  watch(sidebarCollapsed, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
    } catch {
      /* armazenamento indisponível: preferência vale só na sessão */
    }
  })

  /** Alterna entre menu recolhido e expandido. */
  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { sidebarCollapsed, toggleSidebar }
})
