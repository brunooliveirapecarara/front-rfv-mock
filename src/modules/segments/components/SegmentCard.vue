<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import type { RfvSegment } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import { SEGMENTS } from '@/utils/segments'

defineProps<{ segment: RfvSegment; count: number; total: number }>()
</script>

<template>
  <BaseCard interactive class="flex h-full flex-col">
    <h3 class="text-xl font-bold" :style="{ color: SEGMENTS[segment].color }">{{ SEGMENTS[segment].label }}</h3>
    <p class="mt-1 text-sm text-ink-muted">{{ SEGMENTS[segment].description }}</p>
    <p class="mt-4 text-4xl font-bold tracking-tight">{{ count }}</p>
    <p class="text-xs text-ink-muted">{{ total ? Math.round((count / total) * 100) : 0 }}% da base · regra: {{ SEGMENTS[segment].rule }}</p>
    <RouterLink :to="{ path: '/fornecedores', query: { segment } }" class="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold hover:underline">Ver pessoas <ArrowRight class="size-4" aria-hidden="true" /></RouterLink>
  </BaseCard>
</template>
