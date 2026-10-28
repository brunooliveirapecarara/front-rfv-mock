<script setup lang="ts">
import type { Tone } from '@/types'

withDefaults(defineProps<{ value: number; tone?: Tone; label?: string }>(), { tone: 'brand' })
const FILL: Record<Tone, string> = { neutral: 'bg-ink-muted', brand: 'bg-brand', success: 'bg-teal', danger: 'bg-coral', warning: 'bg-brand-strong', info: 'bg-info' }
</script>

<template>
  <div class="h-2.5 w-full overflow-hidden rounded-full bg-sand" role="progressbar" :aria-valuenow="Math.round(value * 100)" aria-valuemin="0" aria-valuemax="100" :aria-label="label">
    <div class="h-full origin-left rounded-full transition-transform duration-500" :class="FILL[tone]" :style="{ transform: `scaleX(${Math.min(1, Math.max(0, value))})` }" />
  </div>
</template>
