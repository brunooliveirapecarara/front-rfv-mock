<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { listCampaigns } from '@/services/campaign-service'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import CampaignCard from '../components/CampaignCard.vue'

const { data: campaigns, loading, error, reload } = useAsyncData(() => listCampaigns())
const status = ref('all')
const tabs = computed(() => {
  const list = campaigns.value ?? []
  return [
    { value: 'all', label: 'Todas', count: list.length },
    { value: 'running', label: 'Em execução', count: list.filter((c) => c.status === 'running').length },
    { value: 'scheduled', label: 'Agendadas', count: list.filter((c) => c.status === 'scheduled').length },
    { value: 'completed', label: 'Concluídas', count: list.filter((c) => c.status === 'completed').length },
    { value: 'draft', label: 'Rascunhos', count: list.filter((c) => c.status === 'draft').length },
  ]
})
const visible = computed(() => (campaigns.value ?? []).filter((c) => status.value === 'all' || c.status === status.value))
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader eyebrow="Promocional" title="Campanhas" subtitle="Público, holdout, canal e resultado. Os envios são simulados.">
      <BaseButton to="/campanhas/nova"><Plus class="size-4" aria-hidden="true" />Nova campanha</BaseButton>
    </PageHeader>
    <BaseTabs v-model="status" :tabs="tabs" />
    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <div v-else-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><BaseSkeleton v-for="n in 6" :key="n" class="h-56 rounded-card" /></div>
    <EmptyState v-else-if="!visible.length" title="Nenhuma campanha aqui" description="Mude o filtro ou crie uma nova campanha." />
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><CampaignCard v-for="c in visible" :key="c.campaignId" :campaign="c" class="rise-in" /></div>
  </div>
</template>
