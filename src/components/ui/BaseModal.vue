<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { X } from 'lucide-vue-next'

defineProps<{ title: string; size?: 'sm' | 'md' | 'lg' }>()
const open = defineModel<boolean>('open', { required: true })

/**
 * Fecha o modal com a tecla Esc.
 *
 * @param event - Evento de teclado.
 */
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) open.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" @click.self="open = false">
        <Transition name="pop" appear>
          <div v-if="open" role="dialog" aria-modal="true" :aria-label="title" class="max-h-[90vh] w-full overflow-y-auto rounded-card bg-surface p-6 shadow-card sm:p-8" :class="{ 'max-w-md': size === 'sm', 'max-w-xl': !size || size === 'md', 'max-w-3xl': size === 'lg' }">
            <header class="mb-4 flex items-start justify-between gap-4">
              <h2 class="text-xl font-bold">{{ title }}</h2>
              <button type="button" class="grid size-9 place-items-center rounded-full transition hover:bg-sand" aria-label="Fechar" @click="open = false"><X class="size-5" /></button>
            </header>
            <slot />
            <footer v-if="$slots.footer" class="mt-6 flex flex-wrap justify-end gap-3"><slot name="footer" /></footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
