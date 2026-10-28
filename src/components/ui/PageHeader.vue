<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; eyebrow?: string }>()
</script>

<template>
  <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p v-if="eyebrow" class="text-sm font-semibold text-brand-strong">{{ eyebrow }}</p>
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 max-w-2xl text-ink-muted">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="flex flex-wrap gap-3"><slot /></div>
  </header>
</template>
