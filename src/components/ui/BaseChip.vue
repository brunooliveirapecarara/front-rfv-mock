<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="model"
    class="inline-flex h-9 items-center gap-1.5 rounded-full border-2 px-3.5 text-sm font-semibold transition duration-150 active:scale-[0.97]"
    :class="model ? 'border-brand bg-brand text-ink' : 'border-line bg-surface text-ink-muted hover:border-brand'"
    @click="model = !model"
  >
    <Check v-if="model" class="size-3.5" aria-hidden="true" />
    <slot />
  </button>
</template>
