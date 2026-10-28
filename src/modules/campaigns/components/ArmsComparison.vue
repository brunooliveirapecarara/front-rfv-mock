<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'
import type { CampaignAudience, CampaignResult } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatPercent } from '@/utils/formatters'

const props = defineProps<{ result: CampaignResult | null; audience: CampaignAudience }>()
const lift = computed(() => (props.result ? (props.result.treatedReturn - props.result.holdoutReturn) * 100 : 0))
</script>

<template>
  <BaseCard>
    <h2 class="text-lg font-bold">Tratado × holdout</h2>
    <p class="text-sm text-ink-muted">Retorno com peças em 30 dias.</p>
    <p v-if="!result" class="mt-6 rounded-2xl bg-sand p-4 text-sm text-ink-muted">O resultado aparece quando a campanha concluir a janela de 30 dias.</p>
    <template v-else>
      <div class="mt-5 grid grid-cols-2 gap-4">
        <div class="rounded-2xl bg-brand-soft p-4"><p class="text-xs font-semibold text-ink-muted">Tratado ({{ audience.treated }})</p><p class="mt-1 text-3xl font-bold">{{ formatPercent(result.treatedReturn) }}</p></div>
        <div class="rounded-2xl bg-sand p-4"><p class="text-xs font-semibold text-ink-muted">Holdout ({{ audience.holdout }})</p><p class="mt-1 text-3xl font-bold">{{ formatPercent(result.holdoutReturn) }}</p></div>
      </div>
      <p class="mt-4 flex items-center gap-2 text-sm font-semibold" :class="lift >= 0 ? 'text-teal-ink' : 'text-coral-ink'"><TrendingUp class="size-5" aria-hidden="true" />Efeito da campanha: {{ lift >= 0 ? '+' : '' }}{{ lift.toFixed(1).replace('.', ',') }} p.p.</p>
    </template>
  </BaseCard>
</template>
