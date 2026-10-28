<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-vue-next'
import type { Tone } from '@/types'
import { TONE_CLASSES } from '@/utils/tones'

const props = withDefaults(defineProps<{ tone?: Tone; title?: string }>(), { tone: 'info' })
const ICONS = { success: CheckCircle2, danger: XCircle, warning: AlertTriangle, info: Info, brand: Info, neutral: Info }
const icon = computed(() => ICONS[props.tone])
</script>

<template>
  <div class="flex gap-3 rounded-2xl border px-4 py-3 text-sm" :class="[TONE_CLASSES[tone].soft, TONE_CLASSES[tone].border]" :role="tone === 'danger' ? 'alert' : 'status'">
    <component :is="icon" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
    <div class="min-w-0">
      <p v-if="title" class="font-semibold">{{ title }}</p>
      <div :class="title ? 'mt-0.5' : ''"><slot /></div>
    </div>
  </div>
</template>
