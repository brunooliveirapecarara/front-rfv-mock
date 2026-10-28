<script setup lang="ts">
import { renderTemplateBody } from '@/utils/template-body'
import { Send } from 'lucide-vue-next'
import type { MessageTemplate } from '@/types'
import ChannelBadge from '@/components/domain/ChannelBadge.vue'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import WhatsappBubble from '@/components/domain/WhatsappBubble.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatDate } from '@/utils/formatters'
import { META_CATEGORIES, PURPOSES, TEMPLATE_STATUS } from '@/utils/labels'

defineProps<{ template: MessageTemplate; submitting: boolean }>()
defineEmits<{ submit: [] }>()
</script>

<template>
  <BaseCard class="flex h-full flex-col gap-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0"><h3 class="truncate font-mono text-sm font-bold">{{ template.name }}</h3><p class="text-xs text-ink-muted">v{{ template.version }} · {{ template.language }} · {{ formatDate(template.updatedAt) }}</p></div>
      <LabelBadge :value="TEMPLATE_STATUS[template.status]" />
    </div>
    <div class="flex flex-wrap items-center gap-3"><ChannelBadge :channel="template.channel" /><BaseBadge :tone="template.purpose === 'promocional' ? 'brand' : 'info'">{{ PURPOSES[template.purpose] }}</BaseBadge></div>
    <p class="text-sm text-ink-muted">Categoria esperada: <strong class="text-ink">{{ META_CATEGORIES[template.expectedCategory] }}</strong> · Meta: <strong class="text-ink">{{ template.metaCategory ? META_CATEGORIES[template.metaCategory] : 'aguardando' }}</strong></p>
    <BaseAlert v-if="template.status === 'category_mismatch'" tone="warning" title="Template travado">A Meta aprovou numa categoria diferente da finalidade. Ele não pode ser usado em campanhas.</BaseAlert>
    <BaseAlert v-if="template.status === 'rejected'" tone="danger" title="Rejeitado pela Meta">Revise o texto e envie novamente.</BaseAlert>
    <div class="rounded-2xl bg-sand p-4"><WhatsappBubble :body="renderTemplateBody(template.body, template.variables)" :buttons="template.buttons" side="in" /></div>
    <BaseButton v-if="template.status === 'draft' || template.status === 'rejected'" class="mt-auto" variant="outline" :loading="submitting" @click="$emit('submit')"><Send class="size-4" aria-hidden="true" />Enviar para aprovação</BaseButton>
  </BaseCard>
</template>
