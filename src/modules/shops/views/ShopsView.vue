<script setup lang="ts">
import { computed } from 'vue'
import { Link2, Store, Wallet } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { listShops } from '@/services/shop-service'
import type { Shop } from '@/types'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseTable, { type TableColumn } from '@/components/ui/BaseTable.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import type { Label } from '@/utils/labels'

const { data, loading, error, reload } = useAsyncData(() => listShops())

const columns: TableColumn[] = [
  { key: 'name', label: 'Loja' },
  { key: 'suppliers', label: 'Fornecedores ativos', align: 'right' },
  { key: 'number', label: 'Número na Central' },
  { key: 'quality', label: 'Qualidade' },
  { key: 'capacity', label: 'Triagem / semana', align: 'right' },
  { key: 'messages', label: 'Mensagens 30d', align: 'right' },
  { key: 'cost', label: 'Custo 30d', align: 'right' },
]
const NUMBER_STATUS: Record<Shop['number']['status'], Label> = {
  connected: { label: 'Conectado', tone: 'success' },
  pending: { label: 'Onboarding pendente', tone: 'warning' },
  not_connected: { label: 'Não conectado', tone: 'neutral' },
}
const QUALITY: Record<NonNullable<Shop['number']['quality']>, Label> = {
  high: { label: 'Alta', tone: 'success' },
  medium: { label: 'Média', tone: 'warning' },
  low: { label: 'Baixa', tone: 'danger' },
}
const connected = computed(() => (data.value ?? []).filter((s) => s.number.status === 'connected').length)
const totalCost = computed(() => (data.value ?? []).reduce((sum, s) => sum + s.cost30d, 0))
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader eyebrow="Rede" title="Lojas e números" subtitle="Estado do número de cada loja na Central, qualidade e custo de mensagens." />
    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard label="Lojas na rede" :value="data ? String(data.length) : undefined" :icon="Store" tone="brand" :loading="loading" />
      <StatCard label="Números conectados" :value="data ? `${connected} de ${data.length}` : undefined" :icon="Link2" tone="success" :loading="loading" />
      <StatCard label="Custo de mensagens (30d)" :value="data ? formatCurrency(totalCost) : undefined" :icon="Wallet" tone="warning" :loading="loading" />
    </div>
    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <BaseCard v-else>
      <BaseTable :columns="columns" :rows="data ?? []" :row-key="(s: Shop) => s.shopId" :loading="loading">
        <template #cell-name="{ row }"><p class="font-semibold">{{ row.name }}</p><p class="text-xs text-ink-muted">{{ row.city }} · {{ row.state }}<BaseBadge v-if="!row.active" tone="neutral" size="sm" class="ml-2">inativa</BaseBadge></p></template>
        <template #cell-suppliers="{ row }"><span class="font-semibold tabular-nums">{{ formatNumber(row.activeSuppliers) }}</span></template>
        <template #cell-number="{ row }"><LabelBadge :value="NUMBER_STATUS[row.number.status]" size="sm" /><p v-if="row.number.coexistence" class="mt-0.5 text-[11px] text-ink-muted">coexistência com o app</p></template>
        <template #cell-quality="{ row }"><LabelBadge v-if="row.number.quality" :value="QUALITY[row.number.quality]" size="sm" /><span v-else class="text-ink-muted">—</span></template>
        <template #cell-capacity="{ row }"><span class="tabular-nums">{{ row.weeklyTriageCapacity || '—' }}</span></template>
        <template #cell-messages="{ row }"><span class="tabular-nums">{{ row.messages30d ? formatNumber(row.messages30d) : '—' }}</span></template>
        <template #cell-cost="{ row }"><span class="tabular-nums">{{ row.cost30d ? formatCurrency(row.cost30d) : '—' }}</span></template>
        <template #empty><EmptyState title="Nenhuma loja" /></template>
      </BaseTable>
    </BaseCard>
  </div>
</template>
