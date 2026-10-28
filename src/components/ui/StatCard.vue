<script setup lang="ts">
import type { Component } from 'vue'
import { TrendingDown, TrendingUp } from 'lucide-vue-next'
import type { Tone } from '@/types'
import { TONE_CLASSES } from '@/utils/tones'
import BaseCard from './BaseCard.vue'
import BaseSkeleton from './BaseSkeleton.vue'

withDefaults(defineProps<{ label: string; value?: string; hint?: string; icon?: Component; tone?: Tone; trend?: number; loading?: boolean }>(), { tone: 'brand' })
</script>

<template>
  <BaseCard interactive class="rise-in">
    <div class="flex items-start justify-between gap-3">
      <p class="text-sm font-semibold text-ink-muted">{{ label }}</p>
      <span v-if="icon" class="grid size-10 place-items-center rounded-full" :class="TONE_CLASSES[tone].soft"><component :is="icon" class="size-5" aria-hidden="true" /></span>
    </div>
    <BaseSkeleton v-if="loading" class="mt-3 h-9 w-28" />
    <p v-else class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{{ value }}</p>
    <p v-if="!loading && (hint || trend !== undefined)" class="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
      <template v-if="trend !== undefined">
        <component :is="trend >= 0 ? TrendingUp : TrendingDown" class="size-4" :class="trend >= 0 ? 'text-teal' : 'text-coral'" aria-hidden="true" />
        <span class="font-semibold" :class="trend >= 0 ? 'text-teal-ink' : 'text-coral-ink'">{{ trend >= 0 ? '+' : '' }}{{ Math.round(trend * 100) }}%</span>
      </template>
      {{ hint }}
    </p>
  </BaseCard>
</template>
