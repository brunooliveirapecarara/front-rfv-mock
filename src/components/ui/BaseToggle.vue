<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

defineProps<{ label?: string; loading?: boolean; disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :aria-label="label"
    :disabled="disabled || loading"
    class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-60"
    :class="model ? 'bg-teal' : 'bg-line'"
    @click="model = !model"
  >
    <span class="absolute left-0.5 grid size-6 place-items-center rounded-full bg-surface shadow transition-transform duration-200" :class="model ? 'translate-x-5' : 'translate-x-0'">
      <Loader2 v-if="loading" class="size-3.5 animate-spin text-ink-muted" aria-hidden="true" />
    </span>
  </button>
</template>
