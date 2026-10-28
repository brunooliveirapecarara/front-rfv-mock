<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
    tone?: 'surface' | 'sand'
    /** Eleva levemente ao passar o mouse. */
    interactive?: boolean
  }>(),
  { as: 'div', padding: 'md', tone: 'surface' },
)

const PADDING = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' }
const classes = computed(() => [
  'rounded-card',
  props.tone === 'sand' ? 'bg-sand' : 'bg-surface',
  PADDING[props.padding],
  props.interactive ? 'transition duration-200 hover:-translate-y-0.5 hover:shadow-card' : '',
])
</script>

<template>
  <component :is="as" :class="classes"><slot /></component>
</template>
