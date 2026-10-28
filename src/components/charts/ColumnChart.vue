<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ points: { label: string; a: number; b?: number }[]; aLabel: string; bLabel?: string }>()
const max = computed(() => Math.max(1, ...props.points.map((p) => p.a)))
</script>

<template>
  <div>
    <div class="flex h-44 items-end gap-3" role="img" :aria-label="`${aLabel} por mês`">
      <div v-for="p in points" :key="p.label" class="flex h-full flex-1 flex-col items-center justify-end gap-1">
        <span class="text-xs font-semibold tabular-nums">{{ p.a }}</span>
        <div class="flex w-full flex-1 items-end justify-center gap-1">
          <div class="w-full max-w-9 origin-bottom rounded-t-xl bg-brand transition-transform duration-500" :style="{ height: `${(p.a / max) * 100}%` }" />
          <div v-if="p.b !== undefined" class="w-full max-w-9 rounded-t-xl bg-ink/80" :style="{ height: `${(p.b / max) * 100}%` }" />
        </div>
        <span class="text-xs text-ink-muted">{{ p.label }}</span>
      </div>
    </div>
    <div class="mt-3 flex gap-4 text-xs text-ink-muted">
      <span class="inline-flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-brand" />{{ aLabel }}</span>
      <span v-if="bLabel" class="inline-flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-ink/80" />{{ bLabel }}</span>
    </div>
  </div>
</template>
