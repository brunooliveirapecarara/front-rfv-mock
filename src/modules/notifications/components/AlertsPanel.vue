<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckCheck } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { useToast } from '@/composables/use-toast'
import { listAlerts, markAlertsRead } from '@/services/notification-service'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { relativeTime } from '@/utils/formatters'

const toast = useToast()
const { data, loading, error, reload } = useAsyncData(() => listAlerts())
const marking = ref(false)
const unread = computed(() => (data.value ?? []).filter((a) => !a.read).length)
const TONE = { info: 'info', warning: 'warning', critical: 'danger' } as const

/** Marca todos os alertas como lidos e recarrega a lista. */
async function markAll(): Promise<void> {
  marking.value = true
  try {
    await markAlertsRead()
    await reload()
    toast.success('Alertas marcados como lidos')
  } catch (e) {
    toast.error('Não foi possível atualizar', e instanceof Error ? e.message : undefined)
  } finally {
    marking.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-ink-muted">{{ unread }} não lidos</p>
      <BaseButton variant="outline" size="sm" :disabled="!unread" :loading="marking" @click="markAll"><CheckCheck class="size-4" aria-hidden="true" />Marcar todos como lidos</BaseButton>
    </div>
    <ErrorState v-if="error" :message="error.message" @retry="reload" />
    <div v-else-if="loading" class="space-y-3"><BaseSkeleton v-for="n in 4" :key="n" class="h-20 w-full" /></div>
    <ul v-else class="flex flex-col gap-3">
      <li v-for="a in data" :key="a.alertId" :class="a.read ? 'opacity-70' : ''">
        <BaseAlert :tone="TONE[a.severity]" :title="a.title">
          {{ a.description }}
          <span class="mt-1 block text-xs opacity-80">{{ relativeTime(a.createdAt) }}<template v-if="a.link"> · <RouterLink :to="a.link" class="font-semibold underline">Abrir</RouterLink></template></span>
        </BaseAlert>
      </li>
    </ul>
  </div>
</template>
