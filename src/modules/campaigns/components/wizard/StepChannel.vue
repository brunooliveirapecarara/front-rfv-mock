<script setup lang="ts">
import { renderTemplateBody } from '@/utils/template-body'
import { computed, watch } from 'vue'
import { useAsyncData } from '@/composables/use-async-data'
import { listTemplates } from '@/services/template-service'
import { useCampaignDraftStore } from '@/stores/campaign-draft'
import type { Channel } from '@/types'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import WhatsappBubble from '@/components/domain/WhatsappBubble.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import { CHANNEL_ICONS } from '@/utils/icons'
import { CHANNELS, META_CATEGORIES, TEMPLATE_STATUS } from '@/utils/labels'

const store = useCampaignDraftStore()
const { data: templates, loading } = useAsyncData(() => listTemplates())
const CHOICES: Channel[] = ['whatsapp', 'email', 'push']
const available = computed(() => (templates.value ?? []).filter((t) => t.purpose === 'promocional' && t.channel === store.draft.channel))
const selected = computed(() => available.value.find((t) => t.templateId === store.draft.templateId))

watch(
  () => store.draft.channel,
  () => (store.draft.templateId = ''),
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <p class="mb-2 text-sm font-semibold">Canal <span class="font-normal text-ink-muted">(um canal por pedido, sem fallback no promocional)</span></p>
      <div class="grid gap-3 sm:grid-cols-3">
        <button v-for="ch in CHOICES" :key="ch" type="button" class="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition duration-150 active:scale-[0.98]" :class="store.draft.channel === ch ? 'border-brand bg-brand-soft' : 'border-line bg-surface hover:border-brand'" :aria-pressed="store.draft.channel === ch" @click="store.draft.channel = ch">
          <component :is="CHANNEL_ICONS[ch]" class="size-6" aria-hidden="true" /><span class="font-bold">{{ CHANNELS[ch] }}</span>
        </button>
      </div>
      <p class="mt-2 text-xs text-ink-muted">SMS não é usado em campanhas promocionais.</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div>
        <p class="mb-2 text-sm font-semibold">Template</p>
        <div v-if="loading" class="space-y-2"><BaseSkeleton v-for="n in 3" :key="n" class="h-16 w-full" /></div>
        <BaseAlert v-else-if="!available.length" tone="warning" title="Sem templates">Nenhum template promocional para este canal.</BaseAlert>
        <ul v-else class="flex flex-col gap-2">
          <li v-for="t in available" :key="t.templateId">
            <button type="button" class="flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-3.5 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-60" :class="store.draft.templateId === t.templateId ? 'border-brand bg-brand-soft' : 'border-line bg-surface enabled:hover:border-brand'" :disabled="t.status !== 'approved'" @click="store.draft.templateId = t.templateId">
              <span class="min-w-0"><span class="block truncate text-sm font-bold">{{ t.name }}</span><span class="text-xs text-ink-muted">v{{ t.version }} · categoria {{ META_CATEGORIES[t.expectedCategory] }}</span></span>
              <LabelBadge :value="TEMPLATE_STATUS[t.status]" size="sm" />
            </button>
          </li>
        </ul>
        <p class="mt-2 text-xs text-ink-muted">Só templates aprovados na categoria esperada podem ser usados.</p>
      </div>
      <div class="rounded-card bg-sand p-5">
        <p class="mb-3 text-sm font-semibold">Pré-visualização</p>
        <WhatsappBubble v-if="selected" :body="renderTemplateBody(selected.body, selected.variables)" :buttons="selected.buttons" side="in" />
        <p v-else class="text-sm text-ink-muted">Escolha um template para visualizar.</p>
      </div>
    </div>
  </div>
</template>
