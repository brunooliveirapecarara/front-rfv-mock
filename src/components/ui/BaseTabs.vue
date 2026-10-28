<script setup lang="ts">
defineProps<{ tabs: { value: string; label: string; count?: number }[] }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex flex-wrap gap-2" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      :aria-selected="model === tab.value"
      class="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-150 active:scale-[0.97]"
      :class="model === tab.value ? 'bg-brand text-ink' : 'bg-surface text-ink-muted hover:bg-brand-soft hover:text-ink'"
      @click="model = tab.value"
    >
      {{ tab.label }}
      <span v-if="tab.count !== undefined" class="rounded-full bg-ink/10 px-1.5 text-[11px]">{{ tab.count }}</span>
    </button>
  </div>
</template>
