<script setup lang="ts">
import { getShopName } from '@/services/shop-service'
import { useCampaignDraftStore } from '@/stores/campaign-draft'
import type { CampaignSimulation } from '@/types'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { CHANNELS } from '@/utils/labels'
import { SEGMENTS } from '@/utils/segments'
import AudienceCascade from '../AudienceCascade.vue'

defineProps<{ simulation: CampaignSimulation | null; loading: boolean }>()
const store = useCampaignDraftStore()
</script>

<template>
  <div class="flex flex-col gap-6">
    <BaseAlert tone="warning" title="Simulação">Ao confirmar, a campanha é registrada como agendada em modo simulado. Nenhuma mensagem é enviada.</BaseAlert>
    <div class="grid gap-6 lg:grid-cols-2">
      <dl class="grid gap-3 text-sm">
        <div class="rounded-2xl bg-sand px-4 py-3"><dt class="text-xs font-semibold text-ink-muted">Campanha</dt><dd class="font-bold">{{ store.draft.name }}</dd><dd class="text-ink-muted">{{ store.draft.objective || 'Sem objetivo informado' }}</dd></div>
        <div class="rounded-2xl bg-sand px-4 py-3"><dt class="text-xs font-semibold text-ink-muted">Público</dt><dd class="font-bold">{{ SEGMENTS[store.draft.segment].label }}</dd><dd class="text-ink-muted">{{ store.draft.shopIds.length ? store.draft.shopIds.map(getShopName).join(', ') : 'Rede toda' }}</dd></div>
        <div class="rounded-2xl bg-sand px-4 py-3"><dt class="text-xs font-semibold text-ink-muted">Canal e template</dt><dd class="font-bold">{{ CHANNELS[store.draft.channel] }} · {{ store.draft.templateId }}</dd></div>
        <div class="rounded-2xl bg-sand px-4 py-3"><dt class="text-xs font-semibold text-ink-muted">Regras</dt><dd class="font-bold">Holdout {{ store.draft.holdoutPercent }}% · teto {{ store.draft.capPerPerson }} · cooldown {{ store.draft.cooldownDays }}d</dd><dd class="text-ink-muted">{{ formatDate(store.draft.startAt) }} até {{ formatDate(store.draft.notAfter) }}</dd></div>
      </dl>
      <div class="flex flex-col gap-4">
        <div v-if="loading || !simulation" class="space-y-2"><BaseSkeleton v-for="n in 6" :key="n" class="h-14 w-full" /></div>
        <template v-else>
          <AudienceCascade :audience="simulation" />
          <div class="flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3"><span class="text-sm font-semibold">Custo estimado · {{ formatCurrency(simulation.costPerMessage) }} por entrega</span><span class="text-xl font-bold">{{ formatCurrency(simulation.estimatedCost) }}</span></div>
        </template>
      </div>
    </div>
  </div>
</template>
