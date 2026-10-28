<script setup lang="ts">
import { renderTemplateBody } from '@/utils/template-body'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Copy, Pause, Play } from 'lucide-vue-next'
import { confirmAction } from '@/composables/use-confirm'
import { useAsyncData } from '@/composables/use-async-data'
import { useToast } from '@/composables/use-toast'
import { getCampaign, setCampaignStatus } from '@/services/campaign-service'
import { listTemplates } from '@/services/template-service'
import FunnelBars from '@/components/charts/FunnelBars.vue'
import ChannelBadge from '@/components/domain/ChannelBadge.vue'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import SegmentBadge from '@/components/domain/SegmentBadge.vue'
import WhatsappBubble from '@/components/domain/WhatsappBubble.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import { CAMPAIGN_STATUS } from '@/utils/labels'
import ArmsComparison from '../components/ArmsComparison.vue'
import AudienceCascade from '../components/AudienceCascade.vue'
import CampaignRulesCard from '../components/CampaignRulesCard.vue'

const props = defineProps<{ campaignId: string }>()
const toast = useToast()
const { data: campaign, loading, error, reload } = useAsyncData(() => getCampaign(props.campaignId))
const { data: templates } = useAsyncData(() => listTemplates())
const template = computed(() => templates.value?.find((t) => t.templateId === campaign.value?.templateId))
const changing = ref(false)

/** Pausa ou retoma a campanha, pedindo confirmação ao pausar. */
async function togglePause(): Promise<void> {
  const current = campaign.value
  if (!current) return
  const pausing = current.status === 'running'
  if (pausing && !(await confirmAction({ title: 'Pausar campanha?', message: 'Novos pedidos deixam de ser criados até você retomar.', confirmLabel: 'Pausar', tone: 'danger' }))) return
  changing.value = true
  try {
    campaign.value = await setCampaignStatus(current.campaignId, pausing ? 'paused' : 'running')
    toast.success(pausing ? 'Campanha pausada' : 'Campanha retomada')
  } catch (e) {
    toast.error('Não foi possível alterar a campanha', e instanceof Error ? e.message : undefined)
  } finally {
    changing.value = false
  }
}
</script>

<template>
  <ErrorState v-if="error" :message="error.message" @retry="reload" />
  <div v-else-if="loading || !campaign" class="flex flex-col gap-6"><BaseSkeleton class="h-24 w-full" /><div class="grid gap-4 sm:grid-cols-4"><BaseSkeleton v-for="n in 4" :key="n" class="h-32 rounded-card" /></div><BaseSkeleton class="h-72 w-full rounded-card" /></div>
  <div v-else class="flex flex-col gap-6">
    <RouterLink to="/campanhas" class="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-ink"><ArrowLeft class="size-4" aria-hidden="true" />Campanhas</RouterLink>
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-3"><LabelBadge :value="CAMPAIGN_STATUS[campaign.status]" /><ChannelBadge :channel="campaign.channel" /><SegmentBadge :segment="campaign.segment" /></div>
        <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{{ campaign.name }}</h1>
        <p class="mt-1 text-ink-muted">{{ campaign.objective }}</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <BaseButton variant="outline" @click="toast.info('Campanha duplicada em rascunho', 'Simulação: nada foi criado de verdade.')"><Copy class="size-4" aria-hidden="true" />Duplicar</BaseButton>
        <BaseButton v-if="campaign.status === 'running' || campaign.status === 'paused'" :loading="changing" @click="togglePause">
          <component :is="campaign.status === 'running' ? Pause : Play" class="size-4" aria-hidden="true" />{{ campaign.status === 'running' ? 'Pausar' : 'Retomar' }}
        </BaseButton>
      </div>
    </header>

    <BaseAlert v-if="campaign.simulated" tone="warning" title="Campanha simulada">Foi criada em modo de simulação: nenhuma mensagem será enviada.</BaseAlert>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Tratado" :value="formatNumber(campaign.audience.treated)" :hint="`holdout: ${campaign.audience.holdout}`" tone="brand" />
      <StatCard label="Entregues" :value="formatNumber(campaign.funnel.delivered)" :hint="`${campaign.funnel.failed} falhas`" tone="success" />
      <StatCard label="Respostas" :value="formatNumber(campaign.funnel.replies)" :hint="`${campaign.funnel.read} lidas`" tone="info" />
      <StatCard label="Custo" :value="formatCurrency(campaign.actualCost || campaign.estimatedCost)" :hint="campaign.actualCost ? 'real' : 'estimado'" tone="warning" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard>
        <h2 class="text-lg font-bold">Funil do braço tratado</h2>
        <p class="mb-4 text-sm text-ink-muted">O holdout não entra no funil: ele nunca é enviado.</p>
        <FunnelBars :steps="[{ label: 'Pedidos ao pr-notify', value: campaign.funnel.requested }, { label: 'Enviados', value: campaign.funnel.sent }, { label: 'Entregues', value: campaign.funnel.delivered }, { label: 'Lidos', value: campaign.funnel.read }, { label: 'Respostas', value: campaign.funnel.replies }]" />
      </BaseCard>
      <ArmsComparison :result="campaign.result" :audience="campaign.audience" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard><h2 class="mb-4 text-lg font-bold">Do elegível ao tratado</h2><AudienceCascade :audience="campaign.audience" /></BaseCard>
      <div class="flex flex-col gap-6">
        <CampaignRulesCard :campaign="campaign" />
        <BaseCard tone="sand">
          <h2 class="mb-3 text-lg font-bold">Template · {{ campaign.templateId }}</h2>
          <WhatsappBubble v-if="template" :body="renderTemplateBody(template.body, template.variables)" :buttons="template.buttons" side="in" />
        </BaseCard>
      </div>
    </div>
  </div>
</template>
