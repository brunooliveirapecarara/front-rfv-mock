<script setup lang="ts">
import type { RfvSegment } from '@/types'
import { SEGMENTS } from '@/utils/segments'
import BaseBadge from '@/components/ui/BaseBadge.vue'

defineProps<{ segment: RfvSegment }>()
</script>

<template>
  <BaseBadge :tone="SEGMENTS[segment].tone" dot>{{ SEGMENTS[segment].label }}</BaseBadge>
</template>
