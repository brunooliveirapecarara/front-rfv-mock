<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MessageCircle } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { useToast } from '@/composables/use-toast'
import { listConversations, markAsRead, simulateReply } from '@/services/conversation-service'
import BaseCard from '@/components/ui/BaseCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ConversationContext from '../components/ConversationContext.vue'
import ConversationList from '../components/ConversationList.vue'
import ConversationThread from '../components/ConversationThread.vue'

const props = defineProps<{ conversationId?: string }>()
const router = useRouter()
const toast = useToast()
const { data: conversations, loading, error, reload } = useAsyncData(() => listConversations())
const sending = ref(false)
const selected = computed(() => conversations.value?.find((c) => c.conversationId === props.conversationId) ?? null)
const unreadTotal = computed(() => (conversations.value ?? []).reduce((sum, c) => sum + c.unread, 0))

watch(
  [conversations, () => props.conversationId],
  ([list, id]) => {
    if (list?.length && !id && window.matchMedia('(min-width: 1024px)').matches) void router.replace(`/conversas/${list[0]!.conversationId}`)
  },
  { immediate: true },
)
watch(selected, (conversation) => {
  if (!conversation?.unread) return
  void markAsRead(conversation.conversationId)
  conversations.value = (conversations.value ?? []).map((c) => (c.conversationId === conversation.conversationId ? { ...c, unread: 0 } : c))
})

/**
 * Registra a resposta simulada e atualiza a conversa na tela.
 *
 * @param text - Texto ou template escolhido.
 */
async function send(text: string): Promise<void> {
  if (!selected.value) return
  sending.value = true
  try {
    const message = await simulateReply(selected.value.conversationId, text)
    conversations.value = (conversations.value ?? []).map((c) => (c.conversationId === selected.value?.conversationId ? { ...c, status: 'waiting', messages: [...c.messages, message] } : c))
    toast.success('Resposta registrada', 'Simulação: nada foi enviado de verdade.')
  } catch (e) {
    toast.error('Não foi possível enviar', e instanceof Error ? e.message : undefined)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader eyebrow="Central de WhatsApp" title="Conversas" :subtitle="`${unreadTotal} mensagens não lidas. Respostas em texto livre só dentro da janela de 24h.`" />
    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <BaseCard v-else padding="none" class="grid h-[calc(100vh-240px)] min-h-[560px] overflow-hidden lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_300px]">
      <section class="min-h-0 flex-col border-r border-line" :class="selected ? 'hidden lg:flex' : 'flex'" aria-label="Lista de conversas">
        <ConversationList :conversations="conversations ?? []" :selected-id="conversationId" :loading="loading" />
      </section>
      <section class="min-h-0 flex-col" :class="selected ? 'flex' : 'hidden lg:flex'" aria-label="Conversa">
        <ConversationThread v-if="selected" :conversation="selected" :sending="sending" @send="send" />
        <EmptyState v-else title="Escolha uma conversa" description="Selecione uma conversa na lista para ver as mensagens." :icon="MessageCircle" />
      </section>
      <aside v-if="selected" class="hidden overflow-y-auto border-l border-line xl:block" aria-label="Contexto da pessoa"><ConversationContext :key="selected.personId" :conversation="selected" /></aside>
    </BaseCard>
  </div>
</template>
