<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import type { Alert } from '@/types'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { CheckCircle2 } from 'lucide-vue-next'

defineProps<{ alerts: Alert[] | null; loading: boolean }>()
const TONE = { info: 'info', warning: 'warning', critical: 'danger' } as const
</script>

<template>
  <BaseCard>
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold">Alertas</h2>
      <RouterLink to="/notificacoes?tab=alerts" class="inline-flex items-center gap-1 text-sm font-semibold hover:underline">Ver todos <ArrowRight class="size-4" aria-hidden="true" /></RouterLink>
    </div>
    <div v-if="loading || !alerts" class="mt-4 space-y-3"><BaseSkeleton v-for="n in 3" :key="n" class="h-16 w-full" /></div>
    <EmptyState v-else-if="!alerts.length" title="Tudo certo por aqui" description="Nenhum alerta pendente." :icon="CheckCircle2" />
    <ul v-else class="mt-4 flex flex-col gap-3">
      <li v-for="a in alerts" :key="a.alertId"><BaseAlert :tone="TONE[a.severity]" :title="a.title">{{ a.description }}</BaseAlert></li>
    </ul>
  </BaseCard>
</template>
