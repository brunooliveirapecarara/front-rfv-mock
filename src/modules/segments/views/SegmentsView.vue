<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncData } from '@/composables/use-async-data'
import { getRfvMatrix, getSegmentCounts } from '@/services/person-service'
import { useScopeStore } from '@/stores/scope'
import RfvHeatmap from '@/components/charts/RfvHeatmap.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import { RFV_THRESHOLDS } from '@/utils/rfv'
import { SEGMENT_ORDER } from '@/utils/segments'
import SegmentCard from '../components/SegmentCard.vue'

const router = useRouter()
const scope = useScopeStore()
const { data: counts, loading, error, reload } = useAsyncData(() => getSegmentCounts(scope.shopId))
const { data: matrix, loading: loadingMatrix } = useAsyncData(() => getRfvMatrix(scope.shopId))
const total = computed(() => Object.values(counts.value ?? {}).reduce((a, b) => a + b, 0))
</script>

<template>
  <div class="flex flex-col gap-8">
    <PageHeader eyebrow="Segmentação" title="Segmentos RFV" :subtitle="`Grupos derivados de recência, frequência e valor. Escopo: ${scope.label}.`" />
    <BaseAlert tone="warning" title="Regras provisórias">Os limiares abaixo são exemplos até o gestor de CRM definir as regras de nota e segmento.</BaseAlert>
    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <template v-else>
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <template v-if="loading || !counts"><BaseSkeleton v-for="n in 8" :key="n" class="h-44 rounded-card" /></template>
        <SegmentCard v-for="s in SEGMENT_ORDER" v-else :key="s" :segment="s" :count="counts[s]" :total="total" class="rise-in" />
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <BaseCard>
          <h2 class="text-lg font-bold">Matriz recência × frequência</h2>
          <p class="mb-4 text-sm text-ink-muted">Clique numa célula para ver as pessoas.</p>
          <BaseSkeleton v-if="loadingMatrix || !matrix" class="h-72 w-full" />
          <RfvHeatmap v-else :matrix="matrix" @select="(r, f) => router.push({ path: '/fornecedores', query: { r, f } })" />
        </BaseCard>
        <BaseCard>
          <div class="flex items-center gap-2"><h2 class="text-lg font-bold">Limiares das notas</h2><BaseBadge tone="warning">provisório</BaseBadge></div>
          <table class="mt-4 w-full text-sm">
            <thead class="text-left text-xs uppercase text-ink-muted"><tr><th class="pb-2">Nota</th><th class="pb-2">R (dias, até)</th><th class="pb-2">F (dias, mín.)</th><th class="pb-2">V (R$, mín.)</th></tr></thead>
            <tbody class="divide-y divide-line">
              <tr v-for="(n, i) in [5, 4, 3, 2]" :key="n"><td class="py-2 font-bold">{{ n }}</td><td>{{ RFV_THRESHOLDS.recency[i] }}</td><td>{{ RFV_THRESHOLDS.frequency[i] }}</td><td>{{ RFV_THRESHOLDS.value[i] }}</td></tr>
              <tr><td class="py-2 font-bold">1</td><td colspan="3" class="text-ink-muted">abaixo dos limiares da nota 2</td></tr>
            </tbody>
          </table>
        </BaseCard>
      </div>
    </template>
  </div>
</template>
