<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import type { Campaign } from '@/types'
import ChannelBadge from '@/components/domain/ChannelBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseProgress from '@/components/ui/BaseProgress.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

defineProps<{ campaigns: Campaign[] | null; loading: boolean }>()
</script>

<template>
  <BaseCard>
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold">Campanhas em execução</h2>
      <RouterLink to="/campanhas" class="inline-flex items-center gap-1 text-sm font-semibold hover:underline">Ver todas <ArrowRight class="size-4" aria-hidden="true" /></RouterLink>
    </div>
    <div v-if="loading || !campaigns" class="mt-4 space-y-3"><BaseSkeleton v-for="n in 2" :key="n" class="h-16 w-full" /></div>
    <EmptyState v-else-if="!campaigns.length" title="Nenhuma campanha em execução" description="Crie uma campanha para começar." />
    <ul v-else class="mt-4 flex flex-col gap-3">
      <li v-for="c in campaigns" :key="c.campaignId">
        <RouterLink :to="`/campanhas/${c.campaignId}`" class="block rounded-2xl bg-sand p-4 transition duration-150 hover:-translate-y-0.5 hover:shadow-card">
          <div class="flex items-center justify-between gap-3">
            <p class="font-semibold">{{ c.name }}</p>
            <ChannelBadge :channel="c.channel" />
          </div>
          <div class="mt-3"><BaseProgress :value="c.funnel.requested / Math.max(1, c.audience.treated)" tone="success" :label="`Progresso de ${c.name}`" /></div>
          <p class="mt-1.5 text-xs text-ink-muted">{{ c.funnel.requested }} de {{ c.audience.treated }} pedidos · {{ c.funnel.replies }} respostas</p>
        </RouterLink>
      </li>
    </ul>
  </BaseCard>
</template>
