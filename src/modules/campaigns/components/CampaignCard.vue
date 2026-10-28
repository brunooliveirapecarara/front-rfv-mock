<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Campaign } from '@/types'
import ChannelBadge from '@/components/domain/ChannelBadge.vue'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import SegmentBadge from '@/components/domain/SegmentBadge.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseProgress from '@/components/ui/BaseProgress.vue'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { CAMPAIGN_STATUS } from '@/utils/labels'

defineProps<{ campaign: Campaign }>()
</script>

<template>
  <RouterLink :to="`/campanhas/${campaign.campaignId}`" class="block h-full">
    <BaseCard interactive class="flex h-full flex-col gap-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="text-lg font-bold leading-tight">{{ campaign.name }}</h3>
          <p class="mt-1 line-clamp-2 text-sm text-ink-muted">{{ campaign.objective }}</p>
        </div>
        <LabelBadge :value="CAMPAIGN_STATUS[campaign.status]" />
      </div>
      <div class="flex flex-wrap items-center gap-3"><ChannelBadge :channel="campaign.channel" /><SegmentBadge :segment="campaign.segment" /><BaseBadge v-if="campaign.simulated" tone="warning">simulada</BaseBadge></div>
      <div>
        <BaseProgress :value="campaign.audience.treated ? campaign.funnel.delivered / campaign.audience.treated : 0" tone="success" :label="`Entregas de ${campaign.name}`" />
        <p class="mt-1.5 text-xs text-ink-muted">{{ campaign.funnel.delivered }} entregues de {{ campaign.audience.treated }} · holdout {{ campaign.audience.holdout }} (não recebe)</p>
      </div>
      <div class="mt-auto flex items-center justify-between border-t border-line pt-3 text-sm">
        <span class="text-ink-muted">{{ campaign.status === 'completed' ? 'Custo real' : 'Custo estimado' }}</span>
        <span class="font-bold">{{ formatCurrency(campaign.status === 'completed' ? campaign.actualCost : campaign.estimatedCost) }}</span>
      </div>
      <p v-if="campaign.result" class="-mt-2 text-xs text-teal-ink">Retorno {{ formatPercent(campaign.result.treatedReturn) }} vs {{ formatPercent(campaign.result.holdoutReturn) }} no holdout</p>
    </BaseCard>
  </RouterLink>
</template>
