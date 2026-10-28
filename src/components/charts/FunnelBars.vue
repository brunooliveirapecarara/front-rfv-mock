<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber, formatPercent } from '@/utils/formatters'

const props = defineProps<{ steps: { label: string; value: number }[] }>()
const top = computed(() => Math.max(1, props.steps[0]?.value ?? 1))
</script>

<template>
  <ol class="flex flex-col gap-3">
    <li v-for="(step, i) in steps" :key="step.label">
      <div class="mb-1 flex justify-between text-sm">
        <span class="font-medium">{{ step.label }}</span>
        <span class="tabular-nums"><strong>{{ formatNumber(step.value) }}</strong><span v-if="i > 0 && steps[i - 1]!.value" class="ml-2 text-xs text-ink-muted">{{ formatPercent(step.value / steps[i - 1]!.value) }} do anterior</span></span>
      </div>
      <div class="h-3 overflow-hidden rounded-full bg-sand">
        <div class="h-full origin-left rounded-full bg-brand transition-transform duration-500" :style="{ transform: `scaleX(${step.value / top})`, width: '100%' }" />
      </div>
    </li>
  </ol>
</template>
