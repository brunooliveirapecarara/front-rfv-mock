<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { Automation } from '@/types'
import ChannelBadge from '@/components/domain/ChannelBadge.vue'
import SegmentBadge from '@/components/domain/SegmentBadge.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseToggle from '@/components/ui/BaseToggle.vue'
import { formatNumber, formatPercent } from '@/utils/formatters'

defineProps<{ automation: Automation; busy: boolean }>()
defineEmits<{ toggle: [active: boolean] }>()
const open = ref(false)
</script>

<template>
  <BaseCard class="flex flex-col gap-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-lg font-bold leading-tight">{{ automation.name }}</h3>
        <p class="mt-1 text-sm text-ink-muted">{{ automation.description }}</p>
      </div>
      <BaseToggle :model-value="automation.active" :loading="busy" :label="`${automation.active ? 'Desligar' : 'Ligar'} ${automation.name}`" @update:model-value="$emit('toggle', $event)" />
    </div>
    <div class="flex flex-wrap items-center gap-3"><ChannelBadge :channel="automation.channel" /><SegmentBadge v-if="automation.segment" :segment="automation.segment" /><BaseBadge :tone="automation.active ? 'success' : 'neutral'" dot>{{ automation.active ? 'Ativa' : 'Desligada' }}</BaseBadge></div>
    <dl class="grid gap-2 text-sm">
      <div><dt class="inline font-semibold">Quando: </dt><dd class="inline text-ink-muted">{{ automation.trigger }}</dd></div>
      <div><dt class="inline font-semibold">Se: </dt><dd class="inline text-ink-muted">{{ automation.condition }}</dd></div>
      <div><dt class="inline font-semibold">Então: </dt><dd class="inline text-ink-muted">{{ automation.action }}</dd></div>
    </dl>
    <BaseAlert v-if="automation.warning" tone="warning">{{ automation.warning }}</BaseAlert>
    <div class="flex items-center justify-between border-t border-line pt-3 text-sm">
      <span class="text-ink-muted">{{ formatNumber(automation.runs30d) }} execuções em 30 dias<template v-if="automation.replyRate !== null"> · {{ formatPercent(automation.replyRate) }} respondem</template></span>
      <button type="button" class="inline-flex items-center gap-1 font-semibold hover:underline" :aria-expanded="open" @click="open = !open">Fluxo <ChevronDown class="size-4 transition-transform duration-200" :class="open ? 'rotate-180' : ''" aria-hidden="true" /></button>
    </div>
    <Transition name="fade">
      <ol v-if="open" class="flex flex-col gap-2">
        <li v-for="(step, i) in automation.steps" :key="step" class="flex items-center gap-3 text-sm"><span class="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold">{{ i + 1 }}</span>{{ step }}</li>
      </ol>
    </Transition>
  </BaseCard>
</template>
