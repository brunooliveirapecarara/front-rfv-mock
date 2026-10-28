<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { getPerson } from '@/services/person-service'
import type { Conversation } from '@/types'
import RfvScore from '@/components/domain/RfvScore.vue'
import SegmentBadge from '@/components/domain/SegmentBadge.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import { findConsent } from '@/utils/consent'
import { formatWholeCurrency } from '@/utils/formatters'
import { CONSENT_STATUS } from '@/utils/labels'

const props = defineProps<{ conversation: Conversation }>()
const { data: person, loading } = useAsyncData(() => getPerson(props.conversation.personId))
</script>

<template>
  <div class="flex flex-col gap-4 p-5">
    <h2 class="text-sm font-bold uppercase tracking-wide text-ink-muted">Contexto</h2>
    <div v-if="loading || !person" class="space-y-3"><BaseSkeleton v-for="n in 4" :key="n" class="h-10 w-full" /></div>
    <template v-else>
      <div class="flex flex-wrap items-center gap-2"><SegmentBadge :segment="person.rfv.segment" /><RfvScore :scores="person.rfv" /></div>
      <dl class="grid gap-2 text-sm">
        <div class="flex justify-between"><dt class="text-ink-muted">Valor 12m</dt><dd class="font-bold">{{ formatWholeCurrency(person.profile.soldValue12m) }}</dd></div>
        <div class="flex justify-between"><dt class="text-ink-muted">Último fornecimento</dt><dd class="font-bold">{{ person.profile.daysSinceLastSupply }} dias</dd></div>
        <div class="flex justify-between"><dt class="text-ink-muted">Telefone</dt><dd class="font-bold">{{ person.maskedPhone }}</dd></div>
      </dl>
      <div>
        <p class="mb-1.5 text-xs font-semibold text-ink-muted">WhatsApp</p>
        <div class="flex flex-wrap gap-2">
          <LabelBadge v-for="p in (['transacional', 'promocional'] as const)" :key="p" :value="{ label: `${p}: ${CONSENT_STATUS[findConsent(person, 'whatsapp', p)?.status ?? 'no_record'].label}`, tone: CONSENT_STATUS[findConsent(person, 'whatsapp', p)?.status ?? 'no_record'].tone }" size="sm" />
        </div>
      </div>
      <RouterLink :to="`/fornecedores/${person.personId}`" class="inline-flex items-center gap-1 text-sm font-semibold hover:underline">Abrir ficha <ArrowRight class="size-4" aria-hidden="true" /></RouterLink>
    </template>
    <RouterLink v-if="conversation.originCampaignId" :to="`/campanhas/${conversation.originCampaignId}`" class="rounded-2xl bg-brand-soft p-3 text-sm transition hover:bg-brand">Veio da campanha <strong>{{ conversation.originCampaignId }}</strong></RouterLink>
  </div>
</template>
