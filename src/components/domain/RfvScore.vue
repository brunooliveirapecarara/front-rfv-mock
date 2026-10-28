<script setup lang="ts">
import type { RfvScores } from '@/types'

defineProps<{ scores: RfvScores }>()
const TONES = ['', 'bg-coral-soft text-coral-ink', 'bg-brand-soft text-warning-ink', 'bg-sand text-ink', 'bg-teal-soft text-teal-ink', 'bg-teal text-white']
</script>

<template>
  <span class="inline-flex gap-1" :aria-label="`Recência ${scores.r}, frequência ${scores.f}, valor ${scores.v}`">
    <span v-for="(value, key) in { R: scores.r, F: scores.f, V: scores.v }" :key="key" class="grid h-7 w-9 place-items-center rounded-full text-xs font-bold" :class="TONES[value]">
      {{ key }}{{ value }}
    </span>
  </span>
</template>
