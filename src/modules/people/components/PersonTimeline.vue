<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { MessageCircle, Package, RotateCcw, Send, ShieldCheck, ShoppingBag } from 'lucide-vue-next'
import type { TimelineEvent, TimelineEventType } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { formatDate, relativeTime } from '@/utils/formatters'

const props = defineProps<{ events: TimelineEvent[] | null; loading: boolean }>()
const filter = ref('all')

const ICONS: Record<TimelineEventType, Component> = { batch: Package, sale: ShoppingBag, return: RotateCcw, message: Send, conversation: MessageCircle, consent: ShieldCheck }
const TABS = [
  { value: 'all', label: 'Tudo' },
  { value: 'batch', label: 'Lotes' },
  { value: 'sale', label: 'Vendas' },
  { value: 'message', label: 'Mensagens' },
  { value: 'consent', label: 'Consentimentos' },
]
const visible = computed(() => (props.events ?? []).filter((e) => filter.value === 'all' || e.type === filter.value))
</script>

<template>
  <BaseCard>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-lg font-bold">Linha do tempo</h2>
      <BaseTabs v-model="filter" :tabs="TABS" />
    </div>
    <div v-if="loading" class="mt-5 space-y-3"><BaseSkeleton v-for="n in 4" :key="n" class="h-14 w-full" /></div>
    <EmptyState v-else-if="!visible.length" title="Sem eventos" description="Nada registrado para este filtro." />
    <ol v-else class="mt-5 flex flex-col">
      <li v-for="e in visible" :key="e.id" class="relative flex gap-4 pb-5 last:pb-0">
        <span class="absolute left-5 top-10 bottom-0 w-px bg-line last:hidden" aria-hidden="true" />
        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft"><component :is="ICONS[e.type]" class="size-5" aria-hidden="true" /></span>
        <div class="min-w-0">
          <p class="font-semibold">{{ e.title }}</p>
          <p class="text-sm text-ink-muted">{{ e.description }}</p>
          <p class="mt-0.5 text-xs text-ink-muted">{{ formatDate(e.date) }} · {{ relativeTime(e.date) }}</p>
        </div>
      </li>
    </ol>
  </BaseCard>
</template>
