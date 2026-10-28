<script setup lang="ts">
import { useAsyncData } from '@/composables/use-async-data'
import { getDashboard } from '@/services/dashboard-service'
import { getSegmentCounts } from '@/services/person-service'
import { useScopeStore } from '@/stores/scope'
import BaseButton from '@/components/ui/BaseButton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DashboardKpis from '../components/DashboardKpis.vue'
import MonthlyEvolution from '../components/MonthlyEvolution.vue'
import RecentAlerts from '../components/RecentAlerts.vue'
import RunningCampaigns from '../components/RunningCampaigns.vue'
import SegmentOverview from '../components/SegmentOverview.vue'
import { Megaphone } from 'lucide-vue-next'

const scope = useScopeStore()
const { data: dashboard, loading, error, reload } = useAsyncData(() => getDashboard(scope.shopId))
const { data: counts, loading: loadingCounts } = useAsyncData(() => getSegmentCounts(scope.shopId))
</script>

<template>
  <div class="flex flex-col gap-8">
    <PageHeader eyebrow="Relacionamento com fornecedores" title="Painel" :subtitle="`Visão de ${scope.label}. Dados fictícios de 28/10/2026.`">
      <BaseButton to="/campanhas/nova"><Megaphone class="size-4" aria-hidden="true" />Nova campanha</BaseButton>
    </PageHeader>

    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <template v-else>
      <DashboardKpis :kpis="dashboard?.kpis ?? null" :loading="loading" />
      <div class="grid gap-6 lg:grid-cols-2">
        <SegmentOverview :counts="counts" :loading="loadingCounts" />
        <MonthlyEvolution :points="dashboard?.monthly ?? null" :loading="loading" />
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <RunningCampaigns :campaigns="dashboard?.runningCampaigns ?? null" :loading="loading" />
        <RecentAlerts :alerts="dashboard?.alerts ?? null" :loading="loading" />
      </div>
    </template>
  </div>
</template>
