<script setup lang="ts">
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-vue-next'
import { useToast } from '@/composables/use-toast'
import { TONE_CLASSES } from '@/utils/tones'

const { toasts, dismiss } = useToast()
const ICONS = { success: CheckCircle2, danger: XCircle, warning: AlertTriangle, info: Info }
</script>

<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" aria-live="polite">
      <div v-for="t in toasts" :key="t.id" class="pointer-events-auto flex items-start gap-3 rounded-2xl border bg-surface p-4 shadow-card" :class="TONE_CLASSES[t.tone].border" :role="t.tone === 'danger' ? 'alert' : 'status'">
        <component :is="ICONS[t.tone]" class="mt-0.5 size-5 shrink-0" :class="TONE_CLASSES[t.tone].accent" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold">{{ t.title }}</p>
          <p v-if="t.message" class="mt-0.5 text-sm text-ink-muted">{{ t.message }}</p>
        </div>
        <button type="button" class="grid size-7 shrink-0 place-items-center rounded-full transition hover:bg-sand" aria-label="Dispensar" @click="dismiss(t.id)"><X class="size-4" /></button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>
