<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAsyncData } from '@/composables/use-async-data'
import { useToast } from '@/composables/use-toast'
import { listTemplates, submitForReview } from '@/services/template-service'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import TemplateCard from '../components/TemplateCard.vue'

const toast = useToast()
const { data, loading, error, reload } = useAsyncData(() => listTemplates())
const filter = ref('all')
const submittingId = ref<string | null>(null)
const tabs = computed(() => {
  const list = data.value ?? []
  return [
    { value: 'all', label: 'Todos', count: list.length },
    { value: 'approved', label: 'Aprovados', count: list.filter((t) => t.status === 'approved').length },
    { value: 'attention', label: 'Precisam de atenção', count: list.filter((t) => t.status === 'rejected' || t.status === 'category_mismatch').length },
    { value: 'draft', label: 'Rascunhos e análise', count: list.filter((t) => t.status === 'draft' || t.status === 'under_review').length },
  ]
})
const visible = computed(() =>
  (data.value ?? []).filter((t) => {
    if (filter.value === 'all') return true
    if (filter.value === 'attention') return t.status === 'rejected' || t.status === 'category_mismatch'
    if (filter.value === 'draft') return t.status === 'draft' || t.status === 'under_review'
    return t.status === filter.value
  }),
)

/**
 * Envia um template para análise (simulado) e atualiza a lista.
 *
 * @param templateId - Template a enviar.
 */
async function submit(templateId: string): Promise<void> {
  submittingId.value = templateId
  try {
    const updated = await submitForReview(templateId)
    data.value = (data.value ?? []).map((t) => (t.templateId === updated.templateId ? updated : t))
    toast.success('Enviado para análise da Meta', 'Simulação: nada foi submetido de verdade.')
  } catch (e) {
    toast.error('Não foi possível enviar', e instanceof Error ? e.message : undefined)
  } finally {
    submittingId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader eyebrow="pr-notify · Central" title="Templates" subtitle="A autoria fica no pr-notify; a submissão à Meta é feita pela Central. Categoria divergente da finalidade trava o uso." />
    <BaseAlert tone="info">Os nomes seguem o padrão <code class="font-mono">rfv.*</code> para campanhas e <code class="font-mono">fornecedor.*</code> para transacionais.</BaseAlert>
    <BaseTabs v-model="filter" :tabs="tabs" />
    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <div v-else-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><BaseSkeleton v-for="n in 6" :key="n" class="h-80 rounded-card" /></div>
    <EmptyState v-else-if="!visible.length" title="Nenhum template" description="Nada para este filtro." />
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><TemplateCard v-for="t in visible" :key="t.templateId" :template="t" :submitting="submittingId === t.templateId" class="rise-in" @submit="submit(t.templateId)" /></div>
  </div>
</template>
