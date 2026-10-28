<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ slices: { label: string; value: number; color: string }[]; size?: number; thickness?: number }>(), { size: 180, thickness: 24 })

const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const total = computed(() => props.slices.reduce((s, x) => s + x.value, 0) || 1)
const arcs = computed(() => {
  let offset = 0
  return props.slices.map((slice) => {
    const length = (slice.value / total.value) * circumference.value
    const arc = { ...slice, dash: `${length} ${circumference.value - length}`, offset: -offset }
    offset += length
    return arc
  })
})
</script>

<template>
  <div class="relative inline-grid place-items-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="-rotate-90" role="img" aria-label="Distribuição por segmento">
      <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" stroke="var(--color-sand)" :stroke-width="thickness" />
      <circle v-for="a in arcs" :key="a.label" :cx="size / 2" :cy="size / 2" :r="radius" fill="none" :stroke="a.color" :stroke-width="thickness" :stroke-dasharray="a.dash" :stroke-dashoffset="a.offset" />
    </svg>
    <div class="absolute inset-0 grid place-items-center text-center"><slot /></div>
  </div>
</template>
