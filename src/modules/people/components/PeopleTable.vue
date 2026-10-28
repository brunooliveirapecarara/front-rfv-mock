<script setup lang="ts">
import type { Channel, Person, PersonFilters } from '@/types'
import RfvScore from '@/components/domain/RfvScore.vue'
import SegmentBadge from '@/components/domain/SegmentBadge.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseTable, { type TableColumn } from '@/components/ui/BaseTable.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { getShopName } from '@/services/shop-service'
import { isContactable } from '@/utils/consent'
import { formatWholeCurrency, relativeTime } from '@/utils/formatters'
import { CHANNEL_ICONS } from '@/utils/icons'
import { CHANNELS } from '@/utils/labels'

defineProps<{ people: Person[]; loading: boolean; sortBy: PersonFilters['sortBy']; direction: PersonFilters['direction'] }>()
const emit = defineEmits<{ sort: [key: PersonFilters['sortBy']]; open: [person: Person] }>()

const columns: TableColumn[] = [
  { key: 'name', label: 'Fornecedor', sortable: true },
  { key: 'segment', label: 'Segmento' },
  { key: 'rfv', label: 'R · F · V' },
  { key: 'score', label: 'Nota', sortable: true, align: 'center' },
  { key: 'sold', label: 'Valor 12m', sortable: true, align: 'right' },
  { key: 'contact', label: 'Contactável', align: 'center' },
  { key: 'last', label: 'Último fornecimento', sortable: true },
]
const SORT_KEYS: Record<string, PersonFilters['sortBy']> = { name: 'name', score: 'score', sold: 'v', last: 'r' }
const CONTACT_CHANNELS: Channel[] = ['whatsapp', 'email', 'push']
</script>

<template>
  <BaseTable
    :columns="columns"
    :rows="people"
    :row-key="(p: Person) => p.personId"
    :loading="loading"
    :sort-by="Object.keys(SORT_KEYS).find((k) => SORT_KEYS[k] === sortBy)"
    :direction="direction"
    clickable
    @sort="(key) => SORT_KEYS[key] && emit('sort', SORT_KEYS[key]!)"
    @row-click="emit('open', $event)"
  >
    <template #cell-name="{ row }">
      <div class="flex items-center gap-3">
        <BaseAvatar :name="row.name" size="sm" />
        <div class="min-w-0">
          <p class="truncate font-semibold">{{ row.name }}</p>
          <p class="text-xs text-ink-muted">{{ getShopName(row.referenceShopId) }} · {{ row.state }}</p>
        </div>
      </div>
    </template>
    <template #cell-segment="{ row }"><SegmentBadge :segment="row.rfv.segment" /></template>
    <template #cell-rfv="{ row }"><RfvScore :scores="row.rfv" /></template>
    <template #cell-score="{ row }">
      <span class="inline-flex items-center gap-2 font-bold tabular-nums">{{ row.rfv.score }}<BaseBadge size="sm" tone="neutral">{{ row.rfv.grade }}</BaseBadge></span>
    </template>
    <template #cell-sold="{ row }"><span class="font-semibold tabular-nums">{{ formatWholeCurrency(row.profile.soldValue12m) }}</span></template>
    <template #cell-contact="{ row }">
      <span v-if="row.doNotContact" class="text-xs font-semibold text-coral-ink">Não comunicável</span>
      <span v-else class="inline-flex gap-1.5">
        <component :is="CHANNEL_ICONS[ch]" v-for="ch in CONTACT_CHANNELS" :key="ch" class="size-4" :class="isContactable(row, ch) ? 'text-teal' : 'text-line'" :aria-label="`${CHANNELS[ch]}: ${isContactable(row, ch) ? 'sim' : 'não'}`" />
      </span>
    </template>
    <template #cell-last="{ row }"><span class="text-ink-muted">{{ relativeTime(row.profile.lastSupplyDate) }}</span></template>
    <template #empty><EmptyState title="Nenhum fornecedor encontrado" description="Ajuste os filtros ou a busca." /></template>
  </BaseTable>
</template>
