<script setup lang="ts">
import { useId, type Component } from 'vue'

defineProps<{
  label?: string
  placeholder?: string
  type?: string
  icon?: Component
  hint?: string
  error?: string
  min?: number
  max?: number
}>()
const model = defineModel<string | number>({ default: '' })
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-semibold text-ink">{{ label }}</label>
    <div class="relative">
      <component :is="icon" v-if="icon" class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
      <input
        :id="id"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :aria-invalid="error ? true : undefined"
        class="h-11 w-full rounded-full border-2 bg-surface px-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
        :class="[icon ? 'pl-11' : '', error ? 'border-coral' : 'border-line']"
      />
    </div>
    <p v-if="error" class="text-xs font-medium text-coral-ink">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-ink-muted">{{ hint }}</p>
  </div>
</template>
