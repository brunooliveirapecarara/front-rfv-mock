<script setup lang="ts">
import type { MonthlyPoint } from '@/services/dashboard-service'
import ColumnChart from '@/components/charts/ColumnChart.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

defineProps<{ points: MonthlyPoint[] | null; loading: boolean }>()
</script>

<template>
  <BaseCard>
    <h2 class="text-lg font-bold">Evolução mensal</h2>
    <p class="text-sm text-ink-muted">Ativos e novos no fim de cada mês (valores ilustrativos).</p>
    <BaseSkeleton v-if="loading || !points" class="mt-5 h-48 w-full" />
    <div v-else class="mt-5"><ColumnChart :points="points.map((p) => ({ label: p.label, a: p.active, b: p.newcomers }))" a-label="Ativos" b-label="Novos" /></div>
  </BaseCard>
</template>
