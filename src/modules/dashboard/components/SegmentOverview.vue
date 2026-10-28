<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RfvSegment } from '@/types'
import DonutChart from '@/components/charts/DonutChart.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import { SEGMENTS, SEGMENT_ORDER } from '@/utils/segments'

const props = defineProps<{ counts: Record<RfvSegment, number> | null; loading: boolean }>()
const slices = computed(() => SEGMENT_ORDER.map((s) => ({ label: SEGMENTS[s].label, value: props.counts?.[s] ?? 0, color: SEGMENTS[s].color, key: s })))
const total = computed(() => slices.value.reduce((sum, s) => sum + s.value, 0))
</script>

<template>
  <BaseCard>
    <h2 class="text-lg font-bold">Fornecedores por segmento</h2>
    <div v-if="loading || !counts" class="mt-5 flex flex-col items-center gap-5 sm:flex-row">
      <BaseSkeleton class="size-44 rounded-full" />
      <div class="flex-1 space-y-2.5"><BaseSkeleton v-for="n in 6" :key="n" class="h-5 w-full" /></div>
    </div>
    <div v-else class="mt-5 flex flex-col items-center gap-6 sm:flex-row">
      <DonutChart :slices="slices">
        <div><p class="text-3xl font-bold">{{ total }}</p><p class="text-xs text-ink-muted">pessoas</p></div>
      </DonutChart>
      <ul class="grid w-full flex-1 gap-1">
        <li v-for="s in slices" :key="s.key">
          <RouterLink :to="{ path: '/fornecedores', query: { segment: s.key } }" class="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-sm transition hover:bg-sand">
            <span class="size-3 rounded-full" :style="{ background: s.color }" aria-hidden="true" />
            <span class="flex-1 font-medium">{{ s.label }}</span>
            <span class="font-semibold tabular-nums">{{ s.value }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </BaseCard>
</template>
