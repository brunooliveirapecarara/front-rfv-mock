<script setup lang="ts">
import { computed } from 'vue'
import type { Person } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatNumber, formatPercent, formatWholeCurrency } from '@/utils/formatters'

const props = defineProps<{ person: Person }>()
const MODALITIES = { consignacao: 'Consignação', compra_pix: 'Compra Pix', compra_credito: 'Compra crédito (Moedas PR)' }

const items = computed(() => {
  const p = props.person.profile
  return [
    ['Sell-through (90 dias)', p.matureProducts ? formatPercent(p.matureProductsSold90d / p.matureProducts) : '—'],
    ['Intervalo médio', p.averageIntervalDays ? `${p.averageIntervalDays} dias` : '—'],
    ['Produtos fornecidos (12m)', formatNumber(p.suppliedProducts12m)],
    ['Lotes (12m)', formatNumber(p.batches12m)],
    ['Peças recusadas (12m)', formatNumber(p.rejectedProducts12m)],
    ['Devoluções (12m)', formatNumber(p.returns12m)],
    ['Saldo Moedas PR', formatWholeCurrency(p.prCoinsBalance)],
    ['Saldo cashback', formatWholeCurrency(p.cashbackBalance)],
    ['Modalidade principal', MODALITIES[p.mainModality]],
    ['Grupo principal', p.mainProductGroup],
    ['Mensagens promocionais (90d)', formatNumber(p.promotionalMessages90d)],
    ['Compras como cliente (12m)', p.purchasedValue12m ? formatWholeCurrency(p.purchasedValue12m) : '—'],
  ]
})
</script>

<template>
  <BaseCard>
    <h2 class="text-lg font-bold">Indicadores</h2>
    <dl class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="[label, value] in items" :key="label" class="rounded-2xl bg-sand px-4 py-3">
        <dt class="text-xs font-semibold text-ink-muted">{{ label }}</dt>
        <dd class="mt-0.5 font-bold">{{ value }}</dd>
      </div>
    </dl>
  </BaseCard>
</template>
