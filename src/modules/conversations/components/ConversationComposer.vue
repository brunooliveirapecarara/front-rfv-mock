<script setup lang="ts">
import { computed, ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { listTemplates } from '@/services/template-service'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { timeRemaining } from '@/utils/formatters'

const props = defineProps<{ windowExpiresAt: string | null; sending: boolean }>()
const emit = defineEmits<{ send: [text: string] }>()

const text = ref('')
const templateId = ref<string | number>('')
const { data: templates } = useAsyncData(() => listTemplates())
const windowOpen = computed(() => props.windowExpiresAt !== null && timeRemaining(props.windowExpiresAt) !== 'expirada')
const options = computed(() => (templates.value ?? []).filter((t) => t.channel === 'whatsapp' && t.status === 'approved').map((t) => ({ value: t.templateId, label: t.name })))
const canSend = computed(() => (windowOpen.value ? text.value.trim().length > 0 : templateId.value !== ''))

/** Emite o texto ou o template escolhido e limpa o campo. */
function submit(): void {
  emit('send', windowOpen.value ? text.value.trim() : `Template ${templateId.value}`)
  text.value = ''
  templateId.value = ''
}
</script>

<template>
  <form class="flex flex-col gap-3 border-t border-line p-4" @submit.prevent="submit">
    <BaseAlert v-if="!windowOpen" tone="warning">A janela de 24h está fechada: só é possível iniciar com um template aprovado.</BaseAlert>
    <div class="flex items-end gap-3">
      <textarea v-if="windowOpen" v-model="text" rows="2" placeholder="Escreva uma resposta (texto livre)" aria-label="Mensagem" class="min-h-11 flex-1 resize-none rounded-2xl border-2 border-line bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-brand" />
      <div v-else class="flex-1"><BaseSelect v-model="templateId" :options="options" placeholder="Escolha um template" /></div>
      <BaseButton type="submit" :disabled="!canSend" :loading="sending"><Send class="size-4" aria-hidden="true" />Enviar</BaseButton>
    </div>
    <p class="text-xs text-ink-muted">Envio simulado: nada é enviado de verdade.</p>
  </form>
</template>
