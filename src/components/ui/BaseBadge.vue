<script setup lang="ts">
import type { Tone } from '@/types'
import { TONE_CLASSES } from '@/utils/tones'

withDefaults(defineProps<{ tone?: Tone; size?: 'sm' | 'md'; dot?: boolean }>(), { tone: 'neutral', size: 'md' })
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap"
    :class="[TONE_CLASSES[tone].soft, size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs']"
  >
    <span v-if="dot" class="size-1.5 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </span>
</template>
