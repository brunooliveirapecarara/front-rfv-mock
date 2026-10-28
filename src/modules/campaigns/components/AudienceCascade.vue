<script setup lang="ts">
import { computed } from 'vue'
import type { CampaignAudience, Tone } from '@/types'
import { TONE_CLASSES } from '@/utils/tones'

const props = defineProps<{ audience: CampaignAudience }>()

interface Row {
  label: string
  value: number
  hint: string
  tone: Tone
  sign: '' | '−'
}

const rows = computed<Row[]>(() => [
  { label: 'Elegíveis', value: props.audience.eligible, hint: 'Segmento e lojas escolhidos', tone: 'neutral', sign: '' },
  { label: 'Sem consentimento', value: props.audience.noConsent, hint: 'Barrado em Campanhas (público)', tone: 'warning', sign: '−' },
  { label: 'Não comunicáveis', value: props.audience.doNotContact, hint: 'Pedido do titular · barrado em todas as camadas', tone: 'danger', sign: '−' },
  { label: 'Sem contato no canal', value: props.audience.noContact, hint: 'Sem telefone, e-mail ou app', tone: 'warning', sign: '−' },
  { label: 'Holdout', value: props.audience.holdout, hint: 'Comparação: registrado, nunca enviado', tone: 'info', sign: '−' },
  { label: 'Tratado', value: props.audience.treated, hint: 'Recebe a campanha pelo pr-notify', tone: 'success', sign: '' },
])
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li v-for="r in rows" :key="r.label" class="flex items-center gap-3 rounded-2xl px-4 py-2.5" :class="TONE_CLASSES[r.tone].soft">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-bold">{{ r.label }}</p>
        <p class="text-xs opacity-80">{{ r.hint }}</p>
      </div>
      <span class="text-xl font-bold tabular-nums">{{ r.value ? r.sign : "" }}{{ r.value }}</span>
    </li>
  </ul>
</template>
