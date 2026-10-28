<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import AlertsPanel from '../components/AlertsPanel.vue'
import DeliveriesPanel from '../components/DeliveriesPanel.vue'

const route = useRoute()
const router = useRouter()
const tab = computed({
  get: () => (route.query.tab === 'alerts' ? 'alerts' : 'deliveries'),
  set: (value: string) => void router.replace({ query: { tab: value } }),
})
const TABS = [
  { value: 'deliveries', label: 'Envios' },
  { value: 'alerts', label: 'Alertas' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader eyebrow="pr-notify" title="Notificações" subtitle="Log de pedidos de envio por canal e alertas do sistema." />
    <BaseAlert tone="warning" title="Simulação">Os envios abaixo são dados fictícios. Este protótipo não dispara nenhuma mensagem.</BaseAlert>
    <BaseTabs v-model="tab" :tabs="TABS" />
    <DeliveriesPanel v-if="tab === 'deliveries'" />
    <AlertsPanel v-else />
  </div>
</template>
