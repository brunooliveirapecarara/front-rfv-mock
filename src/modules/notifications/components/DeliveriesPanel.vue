<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { useDebounced } from '@/composables/use-debounced'
import { getDeliverySummary, listDeliveries } from '@/services/notification-service'
import { getShopName } from '@/services/shop-service'
import type { Channel, Delivery, DeliveryFilters, DeliveryStatus, Purpose } from '@/types'
import ChannelBadge from '@/components/domain/ChannelBadge.vue'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTable, { type TableColumn } from '@/components/ui/BaseTable.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { formatCurrency, formatDateTime, formatNumber } from '@/utils/formatters'
import { BLOCK_LAYERS, CHANNELS, DELIVERY_STATUS, PURPOSES } from '@/utils/labels'

const search = ref('')
const debouncedSearch = useDebounced(search)
const filters = reactive<DeliveryFilters>({ search: '', channel: '', status: '', purpose: '', page: 1, pageSize: 12 })
const { data, loading, error, reload } = useAsyncData(() => listDeliveries({ ...filters, search: debouncedSearch.value }))
const { data: summary } = useAsyncData(() => getDeliverySummary())

const columns: TableColumn[] = [
  { key: 'when', label: 'Quando' },
  { key: 'person', label: 'Pessoa' },
  { key: 'channel', label: 'Canal' },
  { key: 'template', label: 'Template' },
  { key: 'status', label: 'Status' },
  { key: 'detail', label: 'Origem e detalhe' },
  { key: 'cost', label: 'Custo', align: 'right' },
]
const channelOptions = (Object.keys(CHANNELS) as Channel[]).map((c) => ({ value: c, label: CHANNELS[c] }))
const statusOptions = (Object.keys(DELIVERY_STATUS) as DeliveryStatus[]).map((s) => ({ value: s, label: DELIVERY_STATUS[s].label }))
const purposeOptions = (Object.keys(PURPOSES) as Purpose[]).map((p) => ({ value: p, label: PURPOSES[p] }))

/** Volta à primeira página ao mudar qualquer filtro. */
function resetPage(): void {
  filters.page = 1
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Pedidos de envio" :value="summary ? formatNumber(summary.total ?? 0) : undefined" :loading="!summary" tone="brand" />
      <StatCard label="Entregues ou lidos" :value="summary ? formatNumber((summary.delivered ?? 0) + (summary.read ?? 0)) : undefined" :loading="!summary" tone="success" />
      <StatCard label="Bloqueados por opt-out" :value="summary ? formatNumber(summary.blocked_opt_out ?? 0) : undefined" :loading="!summary" tone="danger" />
      <StatCard label="Falhas e expirados" :value="summary ? formatNumber((summary.failed ?? 0) + (summary.expired ?? 0)) : undefined" :loading="!summary" tone="warning" />
    </div>
    <BaseCard class="flex flex-col gap-5">
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <BaseInput v-model="search" :icon="Search" placeholder="Pessoa ou template" @update:model-value="resetPage" />
        <BaseSelect v-model="filters.channel" :options="channelOptions" placeholder="Todos os canais" @update:model-value="resetPage" />
        <BaseSelect v-model="filters.status" :options="statusOptions" placeholder="Todos os status" @update:model-value="resetPage" />
        <BaseSelect v-model="filters.purpose" :options="purposeOptions" placeholder="Todas as finalidades" @update:model-value="resetPage" />
      </div>
      <ErrorState v-if="error" :message="error.message" @retry="reload" />
      <template v-else>
        <BaseTable :columns="columns" :rows="data?.items ?? []" :row-key="(d: Delivery) => d.deliveryId" :loading="loading">
          <template #cell-when="{ row }"><span class="whitespace-nowrap text-ink-muted">{{ formatDateTime(row.createdAt) }}</span></template>
          <template #cell-person="{ row }"><p class="font-semibold">{{ row.name }}</p><p class="text-xs text-ink-muted">{{ getShopName(row.shopId) }}</p></template>
          <template #cell-channel="{ row }"><ChannelBadge :channel="row.channel" /></template>
          <template #cell-template="{ row }"><p class="font-mono text-xs">{{ row.template }}</p><p class="text-xs text-ink-muted">{{ PURPOSES[row.purpose] }}</p></template>
          <template #cell-status="{ row }"><LabelBadge :value="DELIVERY_STATUS[row.status]" size="sm" /></template>
          <template #cell-detail="{ row }">
            <p class="text-xs text-ink-muted">{{ row.sourceSystem }}<template v-if="row.campaignId"> · {{ row.campaignId }} · braço tratado</template></p>
            <p v-if="row.reason" class="text-xs font-semibold text-coral-ink">{{ row.reason }}<template v-if="row.blockLayer"> · {{ BLOCK_LAYERS[row.blockLayer] }}</template></p>
          </template>
          <template #cell-cost="{ row }"><span class="tabular-nums">{{ row.cost ? formatCurrency(row.cost) : '—' }}</span></template>
          <template #empty><EmptyState title="Nenhum envio" description="Mude os filtros." /></template>
        </BaseTable>
        <BasePagination v-if="data" v-model="filters.page" :total="data.total" :page-size="filters.pageSize" />
      </template>
    </BaseCard>
  </div>
</template>
