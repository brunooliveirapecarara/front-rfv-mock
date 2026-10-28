<script setup lang="ts">
import type { Channel } from '@/types'
import { CHANNEL_ICONS } from '@/utils/icons'
import { CHANNELS } from '@/utils/labels'

defineProps<{ channel: Channel }>()
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-sm font-medium">
    <component :is="CHANNEL_ICONS[channel]" class="size-4 text-ink-muted" aria-hidden="true" />
    {{ CHANNELS[channel] }}
  </span>
</template>
