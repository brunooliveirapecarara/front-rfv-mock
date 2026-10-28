<script setup lang="ts">
import { computed } from 'vue'
import { getShopOptions } from '@/services/shop-service'
import { useCampaignDraftStore } from '@/stores/campaign-draft'
import type { CampaignSimulation, RfvSegment } from '@/types'
import BaseChip from '@/components/ui/BaseChip.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import { SEGMENTS, SEGMENT_ORDER } from '@/utils/segments'
import AudienceCascade from '../AudienceCascade.vue'

defineProps<{ simulation: CampaignSimulation | null; loading: boolean }>()
const store = useCampaignDraftStore()
const shops = getShopOptions()
const segmentOptions = SEGMENT_ORDER.map((s) => ({ value: s, label: SEGMENTS[s].label }))
const description = computed(() => SEGMENTS[store.draft.segment].description)

/**
 * Liga ou desliga uma loja no público.
 *
 * @param shopId - Loja alternada.
 */
function toggleShop(shopId: number): void {
  const ids = store.draft.shopIds
  store.draft.shopIds = ids.includes(shopId) ? ids.filter((id) => id !== shopId) : [...ids, shopId]
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <div class="flex flex-col gap-5">
      <BaseSelect :model-value="store.draft.segment" :options="segmentOptions" label="Segmento" @update:model-value="store.draft.segment = $event as RfvSegment" />
      <p class="-mt-3 text-sm text-ink-muted">{{ description }}</p>
      <div>
        <p class="mb-2 text-sm font-semibold">Lojas <span class="font-normal text-ink-muted">(nenhuma marcada = rede toda)</span></p>
        <div class="flex flex-wrap gap-2"><BaseChip v-for="s in shops" :key="s.value" :model-value="store.draft.shopIds.includes(s.value)" @update:model-value="toggleShop(s.value)">{{ s.label.replace('Peça Rara ', '') }}</BaseChip></div>
      </div>
    </div>
    <div>
      <p class="mb-2 text-sm font-semibold">Alcance estimado</p>
      <div v-if="loading || !simulation" class="space-y-2"><BaseSkeleton v-for="n in 6" :key="n" class="h-14 w-full" /></div>
      <AudienceCascade v-else :audience="simulation" />
    </div>
  </div>
</template>
