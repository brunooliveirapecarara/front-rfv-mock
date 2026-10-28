<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ items: { label: string; value: number; color?: string }[]; format?: (value: number) => string }>()
const max = computed(() => Math.max(1, ...props.items.map((i) => i.value)))
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li v-for="item in items" :key="item.label">
      <div class="mb-1 flex justify-between text-sm">
        <span class="font-medium">{{ item.label }}</span>
        <span class="font-semibold tabular-nums">{{ format ? format(item.value) : item.value }}</span>
      </div>
      <div class="h-2.5 overflow-hidden rounded-full bg-sand">
        <div class="h-full origin-left rounded-full transition-transform duration-500" :style="{ background: item.color ?? 'var(--color-brand)', transform: `scaleX(${item.value / max})`, width: '100%' }" />
      </div>
    </li>
  </ul>
</template>
