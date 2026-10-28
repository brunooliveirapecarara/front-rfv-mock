<script setup lang="ts">
import { CalendarClock, Repeat, Wallet } from 'lucide-vue-next'
import type { Person } from '@/types'
import StatCard from '@/components/ui/StatCard.vue'
import { formatWholeCurrency } from '@/utils/formatters'

const props = defineProps<{ person: Person }>()

/**
 * Variação relativa entre o valor atual e o do período anterior.
 *
 * @param current - Valor atual.
 * @param previous - Valor anterior.
 * @returns Razão da variação (ex.: 0,2 = +20%).
 */
function variation(current: number, previous: number): number {
  return previous ? (current - previous) / previous : 0
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <StatCard label="Recência (R)" :value="`${person.profile.daysSinceLastSupply} dias`" :hint="`nota ${person.rfv.r}/5 · desde o último fornecimento`" :icon="CalendarClock" tone="info" />
    <StatCard label="Frequência (F)" :value="`${person.profile.supplyDays12m} dias`" :trend="variation(person.profile.supplyDays12m, person.profile.supplyDays12mPrev)" :hint="`nota ${person.rfv.f}/5 · vs. ano anterior`" :icon="Repeat" tone="success" />
    <StatCard label="Valor (V)" :value="formatWholeCurrency(person.profile.soldValue12m)" :trend="variation(person.profile.soldValue12m, props.person.profile.soldValue12mPrev)" :hint="`nota ${person.rfv.v}/5 · vendido em 12 meses`" :icon="Wallet" tone="brand" />
  </div>
</template>
