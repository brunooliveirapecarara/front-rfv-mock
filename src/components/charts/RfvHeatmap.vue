<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ matrix: number[][] }>()
const emit = defineEmits<{ select: [r: number, f: number] }>()
const max = computed(() => Math.max(1, ...props.matrix.flat()))
</script>

<template>
  <div class="overflow-x-auto">
    <div class="grid min-w-[360px] grid-cols-[auto_repeat(5,1fr)] gap-1.5 text-sm">
      <span />
      <span v-for="f in 5" :key="f" class="text-center text-xs font-semibold text-ink-muted">F{{ f }}</span>
      <template v-for="(row, i) in matrix" :key="i">
        <span class="grid place-items-center pr-2 text-xs font-semibold text-ink-muted">R{{ 5 - i }}</span>
        <button
          v-for="(count, j) in row"
          :key="j"
          type="button"
          class="grid h-12 place-items-center rounded-xl font-bold tabular-nums transition duration-150 hover:scale-105 hover:shadow-card"
          :style="{ background: `color-mix(in srgb, var(--color-brand) ${Math.round((count / max) * 100)}%, var(--color-sand))` }"
          :aria-label="`Recência ${5 - i}, frequência ${j + 1}: ${count} fornecedores`"
          @click="emit('select', 5 - i, j + 1)"
        >
          {{ count }}
        </button>
      </template>
    </div>
  </div>
</template>
