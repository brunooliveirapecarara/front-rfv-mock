<script setup lang="ts">
import { useId } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { Option } from '@/types'

const props = defineProps<{ options: Option<string | number>[]; label?: string; placeholder?: string; labelTone?: 'default' | 'section' }>()
const model = defineModel<string | number>({ default: '' })
const id = useId()

/**
 * Converte o valor textual do select de volta ao tipo original da opção.
 *
 * @param event - Evento de mudança do select.
 */
function onChange(event: Event): void {
  const raw = (event.target as HTMLSelectElement).value
  model.value = props.options.find((o) => String(o.value) === raw)?.value ?? raw
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="id"
      :class="labelTone === 'section' ? 'px-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted' : 'text-sm font-semibold text-ink'"
    >{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        :value="String(model)"
        class="h-11 w-full appearance-none rounded-full border-2 border-line bg-surface pl-4 pr-10 text-sm text-ink outline-none transition focus:border-brand"
        @change="onChange"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option v-for="o in options" :key="String(o.value)" :value="String(o.value)">{{ o.label }}</option>
      </select>
      <ChevronDown class="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
    </div>
  </div>
</template>
