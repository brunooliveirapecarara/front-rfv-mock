<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { X } from 'lucide-vue-next'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const drawerOpen = ref(false)
const ui = useUiStore()

/**
 * Fecha o drawer móvel com a tecla Esc.
 *
 * @param event - Evento de teclado.
 */
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') drawerOpen.value = false
}

watch(() => route.path, () => (drawerOpen.value = false))
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="min-h-screen transition-[grid-template-columns] duration-200 lg:grid" :class="ui.sidebarCollapsed ? 'lg:grid-cols-[84px_1fr]' : 'lg:grid-cols-[272px_1fr]'">
    <aside class="sticky top-0 hidden h-screen border-r border-line bg-surface lg:block" aria-label="Menu lateral">
      <AppSidebar collapsible />
    </aside>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="drawerOpen" class="fixed inset-0 z-50 bg-ink/40 lg:hidden" @click.self="drawerOpen = false">
          <Transition name="drawer" appear>
            <aside v-if="drawerOpen" class="relative h-full w-[min(86vw,300px)] bg-surface shadow-card" aria-label="Menu lateral">
              <button type="button" class="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full transition hover:bg-sand" aria-label="Fechar menu" @click="drawerOpen = false"><X class="size-5" /></button>
              <AppSidebar />
            </aside>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <div class="flex min-w-0 flex-col">
      <AppTopbar @menu="drawerOpen = true" />
      <main class="w-full flex-1 px-4 py-8 sm:px-8">
        <RouterView v-slot="{ Component, route: current }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="current.path" />
          </Transition>
        </RouterView>
      </main>
      <footer class="border-t border-line bg-surface py-5 text-center text-xs text-ink-muted">Protótipo com dados fictícios · nenhuma mensagem é enviada</footer>
    </div>

    <ToastHost />
    <ConfirmDialog />
  </div>
</template>
