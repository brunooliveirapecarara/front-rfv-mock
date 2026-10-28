<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Conversation } from '@/types'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { getShopName } from '@/services/shop-service'
import { formatTime } from '@/utils/formatters'
import { CONVERSATION_STATUS } from '@/utils/labels'

defineProps<{ conversations: Conversation[]; selectedId?: string; loading: boolean }>()
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div v-if="loading" class="space-y-2 p-3"><BaseSkeleton v-for="n in 6" :key="n" class="h-16 w-full" /></div>
    <EmptyState v-else-if="!conversations.length" title="Nenhuma conversa" />
    <ul v-else class="flex flex-col p-2">
      <li v-for="c in conversations" :key="c.conversationId">
        <RouterLink :to="`/conversas/${c.conversationId}`" class="flex items-center gap-3 rounded-2xl p-3 transition duration-150 hover:bg-sand" :class="selectedId === c.conversationId ? 'bg-brand-soft' : ''">
          <BaseAvatar :name="c.name" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2"><p class="truncate text-sm font-bold">{{ c.name }}</p><span class="shrink-0 text-[11px] text-ink-muted">{{ formatTime(c.messages.at(-1)!.sentAt) }}</span></div>
            <p class="truncate text-xs text-ink-muted">{{ c.messages.at(-1)!.text }}</p>
            <div class="mt-1 flex items-center gap-2"><LabelBadge :value="CONVERSATION_STATUS[c.status]" size="sm" /><span class="text-[11px] text-ink-muted">{{ getShopName(c.shopId) }}</span></div>
          </div>
          <span v-if="c.unread" class="grid size-5 shrink-0 place-items-center rounded-full bg-coral-ink text-[11px] font-bold text-white">{{ c.unread }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
