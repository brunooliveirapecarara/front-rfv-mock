<script setup lang="ts">
import type { Label } from '@/utils/labels'
import BaseBadge from '@/components/ui/BaseBadge.vue'

defineProps<{ value: Label; size?: 'sm' | 'md' }>()
</script>

<template>
  <BaseBadge :tone="value.tone" :size="size" dot>{{ value.label }}</BaseBadge>
</template>
