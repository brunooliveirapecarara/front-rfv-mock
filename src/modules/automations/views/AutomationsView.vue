<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAsyncData } from '@/composables/use-async-data'
import { confirmAction } from '@/composables/use-confirm'
import { useToast } from '@/composables/use-toast'
import { listAutomations, setAutomationActive } from '@/services/automation-service'
import type { Automation } from '@/types'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import AutomationCard from '../components/AutomationCard.vue'

const toast = useToast()
const { data, loading, error, reload } = useAsyncData(() => listAutomations())
const busyId = ref<string | null>(null)
const reactive = computed(() => (data.value ?? []).filter((a) => a.kind === 'reactive'))
const proactive = computed(() => (data.value ?? []).filter((a) => a.kind === 'proactive'))

/**
 * Liga ou desliga uma automação, confirmando antes de desligar.
 *
 * @param automation - Automação alvo.
 * @param active - Novo estado.
 */
async function toggle(automation: Automation, active: boolean): Promise<void> {
  if (!active && !(await confirmAction({ title: `Desligar "${automation.name}"?`, message: 'Ela deixa de rodar até você ligar de novo.', confirmLabel: 'Desligar', tone: 'danger' }))) return
  busyId.value = automation.automationId
  try {
    const updated = await setAutomationActive(automation.automationId, active)
    data.value = (data.value ?? []).map((a) => (a.automationId === updated.automationId ? updated : a))
    toast.success(active ? 'Automação ligada' : 'Automação desligada', automation.name)
  } catch (e) {
    toast.error('Não foi possível alterar a automação', e instanceof Error ? e.message : undefined)
  } finally {
    busyId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <PageHeader eyebrow="Automações" title="Reativas e proativas" subtitle="Se a conversa começa com o fornecedor, responde a Central. Se começa com uma decisão nossa, é o motor de campanhas." />
    <BaseAlert tone="info" title="No número da loja, a automação só atua em três casos">Fora do horário, resposta a botão de mensagem nossa e fluxos que o atendente dispara. Quando o atendente responde pelo app (echo), a automação sai da conversa.</BaseAlert>
    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <div v-else-if="loading" class="grid gap-6 lg:grid-cols-2"><BaseSkeleton v-for="n in 4" :key="n" class="h-64 rounded-card" /></div>
    <template v-else>
      <section>
        <h2 class="mb-1 text-2xl font-bold">Reativas <span class="text-base font-medium text-ink-muted">· Central → Meta</span></h2>
        <p class="mb-4 text-sm text-ink-muted">Texto livre dentro da janela de 24h, sem passar pelo pr-notify.</p>
        <div class="grid gap-6 lg:grid-cols-2"><AutomationCard v-for="a in reactive" :key="a.automationId" :automation="a" :busy="busyId === a.automationId" class="rise-in" @toggle="toggle(a, $event)" /></div>
      </section>
      <section>
        <h2 class="mb-1 text-2xl font-bold">Proativas <span class="text-base font-medium text-ink-muted">· motor → pr-notify → Central → Meta</span></h2>
        <p class="mb-4 text-sm text-ink-muted">Template aprovado, categoria marketing, com opt-in. Sempre com holdout e teto por pessoa.</p>
        <div class="grid gap-6 lg:grid-cols-2"><AutomationCard v-for="a in proactive" :key="a.automationId" :automation="a" :busy="busyId === a.automationId" class="rise-in" @toggle="toggle(a, $event)" /></div>
      </section>
    </template>
  </div>
</template>
