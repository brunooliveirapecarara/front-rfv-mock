<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Send } from 'lucide-vue-next'
import { confirmAction } from '@/composables/use-confirm'
import { useAsyncData } from '@/composables/use-async-data'
import { useToast } from '@/composables/use-toast'
import { createSimulatedCampaign, simulateCampaign } from '@/services/campaign-service'
import { useCampaignDraftStore } from '@/stores/campaign-draft'
import type { RfvSegment } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseStepper from '@/components/ui/BaseStepper.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StepAudience from '../components/wizard/StepAudience.vue'
import StepChannel from '../components/wizard/StepChannel.vue'
import StepObjective from '../components/wizard/StepObjective.vue'
import StepReview from '../components/wizard/StepReview.vue'
import StepRules from '../components/wizard/StepRules.vue'

const STEPS = ['Objetivo', 'Público', 'Canal e template', 'Regras', 'Revisão']

const store = useCampaignDraftStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
store.reset()
if (typeof route.query.segment === 'string') store.draft.segment = route.query.segment as RfvSegment

const { data: simulation, loading } = useAsyncData(() =>
  simulateCampaign({ segment: store.draft.segment, shopIds: [...store.draft.shopIds], channel: store.draft.channel, holdoutPercent: store.draft.holdoutPercent }),
)
const submitting = ref(false)
const isLast = computed(() => store.step === STEPS.length - 1)
const canAdvance = computed(() => {
  const d = store.draft
  switch (store.step) {
    case 0:
      return d.name.trim().length >= 3
    case 1:
      return (simulation.value?.treated ?? 0) > 0
    case 2:
      return d.templateId !== ''
    case 3:
      return d.holdoutPercent >= 0 && d.holdoutPercent <= 50 && d.capPerPerson >= 1 && d.notAfter > d.startAt
    default:
      return !loading.value && simulation.value !== null
  }
})

/** Pede confirmação e registra a campanha como simulada; nada é enviado. */
async function submit(): Promise<void> {
  if (!simulation.value) return
  const ok = await confirmAction({ title: 'Simular envio?', message: 'A campanha será agendada em modo simulado. Nenhuma mensagem será enviada.', confirmLabel: 'Simular envio' })
  if (!ok) return
  submitting.value = true
  try {
    const campaign = await createSimulatedCampaign({ ...store.draft, shopIds: [...store.draft.shopIds] }, simulation.value)
    toast.success('Campanha agendada em modo simulado', 'Nenhuma mensagem foi enviada.')
    await router.push(`/campanhas/${campaign.campaignId}`)
  } catch (e) {
    toast.error('Não foi possível criar a campanha', e instanceof Error ? e.message : undefined)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader eyebrow="Nova campanha" title="Monte sua campanha" subtitle="Cinco passos, com simulação de alcance e custo antes de confirmar." />
    <BaseCard class="flex flex-col gap-6">
      <BaseStepper :steps="STEPS" :current="store.step" />
      <Transition name="fade" mode="out-in">
        <StepObjective v-if="store.step === 0" />
        <StepAudience v-else-if="store.step === 1" :simulation="simulation" :loading="loading" />
        <StepChannel v-else-if="store.step === 2" />
        <StepRules v-else-if="store.step === 3" />
        <StepReview v-else :simulation="simulation" :loading="loading" />
      </Transition>
      <div class="flex items-center justify-between border-t border-line pt-5">
        <BaseButton v-if="store.step > 0" variant="ghost" @click="store.step--"><ArrowLeft class="size-4" aria-hidden="true" />Voltar</BaseButton>
        <BaseButton v-else variant="ghost" to="/campanhas">Cancelar</BaseButton>
        <BaseButton v-if="!isLast" :disabled="!canAdvance" @click="store.step++">Continuar<ArrowRight class="size-4" aria-hidden="true" /></BaseButton>
        <BaseButton v-else :disabled="!canAdvance" :loading="submitting" @click="submit"><Send class="size-4" aria-hidden="true" />Simular envio</BaseButton>
      </div>
    </BaseCard>
  </div>
</template>
