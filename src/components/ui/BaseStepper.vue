<script setup lang="ts">
import { Check } from 'lucide-vue-next'

defineProps<{ steps: string[]; current: number }>()
</script>

<template>
  <ol class="flex items-center gap-2 overflow-x-auto pb-1">
    <li v-for="(step, i) in steps" :key="step" class="flex shrink-0 items-center gap-2" :aria-current="i === current ? 'step' : undefined">
      <span
        class="grid size-8 place-items-center rounded-full text-sm font-bold transition-colors duration-200"
        :class="i < current ? 'bg-teal text-white' : i === current ? 'bg-brand text-ink' : 'bg-sand text-ink-muted'"
      >
        <Check v-if="i < current" class="size-4" aria-hidden="true" />
        <template v-else>{{ i + 1 }}</template>
      </span>
      <span class="hidden text-sm font-semibold sm:inline" :class="i === current ? 'text-ink' : 'text-ink-muted'">{{ step }}</span>
      <span v-if="i < steps.length - 1" class="h-0.5 w-6 rounded bg-line sm:w-10" aria-hidden="true" />
    </li>
  </ol>
</template>
