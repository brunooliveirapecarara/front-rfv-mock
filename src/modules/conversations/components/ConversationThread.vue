<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, BotOff } from 'lucide-vue-next'
import type { Conversation, ConversationMessage } from '@/types'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import WhatsappBubble from '@/components/domain/WhatsappBubble.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { getShopName } from '@/services/shop-service'
import { formatTime } from '@/utils/formatters'
import { CONVERSATION_STATUS } from '@/utils/labels'
import ConversationComposer from './ConversationComposer.vue'
import WindowIndicator from './WindowIndicator.vue'

const props = defineProps<{ conversation: Conversation; sending: boolean }>()
defineEmits<{ send: [text: string] }>()

const scroller = ref<HTMLElement | null>(null)
const CAPTIONS: Record<ConversationMessage['author'], string> = { supplier: '', agent: 'Atendente', automation: 'Automação', campaign: 'Campanha' }

watch(
  () => [props.conversation.conversationId, props.conversation.messages.length],
  () => nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight })),
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <header class="flex flex-wrap items-center gap-3 border-b border-line p-4">
      <RouterLink to="/conversas" class="grid size-9 place-items-center rounded-full transition hover:bg-sand lg:hidden" aria-label="Voltar às conversas"><ArrowLeft class="size-5" /></RouterLink>
      <BaseAvatar :name="conversation.name" />
      <div class="min-w-0 flex-1"><p class="truncate font-bold">{{ conversation.name }}</p><p class="text-xs text-ink-muted">{{ getShopName(conversation.shopId) }}</p></div>
      <div class="flex basis-full flex-wrap items-center gap-2">
        <LabelBadge :value="CONVERSATION_STATUS[conversation.status]" />
        <WindowIndicator :expires-at="conversation.windowExpiresAt" />
        <BaseBadge v-if="conversation.automationPaused" tone="info"><BotOff class="size-3.5" aria-hidden="true" />Atendente assumiu · automação pausada</BaseBadge>
      </div>
    </header>
    <div ref="scroller" class="flex flex-1 flex-col gap-3 overflow-y-auto bg-sand/60 p-4">
      <div v-for="m in conversation.messages" :key="m.id" class="rise-in">
        <p v-if="CAPTIONS[m.author]" class="mb-0.5 text-[11px] font-semibold text-ink-muted" :class="m.author === 'supplier' ? '' : 'text-right'">{{ CAPTIONS[m.author] }}<template v-if="m.campaignId"> · {{ m.campaignId }}</template></p>
        <p v-if="m.button" class="mb-1 text-xs font-semibold text-info-ink">Clicou em «{{ m.button }}»</p>
        <WhatsappBubble :body="m.text" :time="formatTime(m.sentAt)" :side="m.author === 'supplier' ? 'in' : 'out'" />
      </div>
    </div>
    <ConversationComposer :window-expires-at="conversation.windowExpiresAt" :sending="sending" @send="$emit('send', $event)" />
  </div>
</template>
