<script setup lang="ts">
import { initials } from '@/utils/formatters'

withDefaults(defineProps<{ name: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
const SIZES = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-16 text-xl' }
</script>

<template>
  <span class="inline-grid shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-ink" :class="SIZES[size]" aria-hidden="true">
    {{ initials(name) }}
  </span>
</template>
