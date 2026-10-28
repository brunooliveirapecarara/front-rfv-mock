<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ text: string; disabled?: boolean }>(), { disabled: false })

const trigger = ref<HTMLElement | null>(null)
const visible = ref(false)
const position = ref({ top: 0, left: 0 })

/** Posiciona o tooltip à direita do elemento e o exibe. */
function show(): void {
  const rect = trigger.value?.getBoundingClientRect()
  if (!rect) return
  position.value = { top: rect.top + rect.height / 2, left: rect.right + 10 }
  visible.value = true
}

/** Oculta o tooltip. */
function hide(): void {
  visible.value = false
}
</script>

<template>
  <div ref="trigger" class="block" @mouseenter="show" @mouseleave="hide" @focusin="show" @focusout="hide">
    <slot />
    <Teleport to="body">
      <Transition name="fade">
        <span
          v-if="visible && !disabled"
          role="tooltip"
          class="pointer-events-none fixed z-[60] -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-card"
          :style="{ top: `${position.top}px`, left: `${position.left}px` }"
        >{{ text }}</span>
      </Transition>
    </Teleport>
  </div>
</template>
