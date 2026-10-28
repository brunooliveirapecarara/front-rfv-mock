<script setup lang="ts" generic="T extends object">
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import BaseSkeleton from './BaseSkeleton.vue'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
  class?: string
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    rows: T[]
    rowKey: (row: T) => string | number
    loading?: boolean
    skeletonRows?: number
    sortBy?: string
    direction?: 'asc' | 'desc'
    clickable?: boolean
  }>(),
  { skeletonRows: 6, direction: 'desc' },
)
const emit = defineEmits<{ sort: [key: string]; rowClick: [row: T] }>()

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' }
</script>

<template>
  <div class="overflow-x-auto rounded-2xl border border-line">
    <table class="w-full min-w-[720px] border-collapse text-sm">
      <thead class="bg-sand text-xs uppercase tracking-wide text-ink-muted">
        <tr>
          <th v-for="c in columns" :key="c.key" scope="col" class="px-4 py-3 font-semibold" :class="[ALIGN[c.align ?? 'left'], c.class]" :aria-sort="sortBy === c.key ? (direction === 'asc' ? 'ascending' : 'descending') : undefined">
            <button v-if="c.sortable" type="button" class="inline-flex items-center gap-1 uppercase transition hover:text-ink" @click="emit('sort', c.key)">
              {{ c.label }}
              <component :is="direction === 'asc' ? ArrowUp : ArrowDown" v-if="sortBy === c.key" class="size-3.5" aria-hidden="true" />
            </button>
            <template v-else>{{ c.label }}</template>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line">
        <template v-if="loading">
          <tr v-for="n in props.skeletonRows" :key="n">
            <td v-for="c in columns" :key="c.key" class="px-4 py-3.5"><BaseSkeleton class="h-5 w-full max-w-40" /></td>
          </tr>
        </template>
        <template v-else-if="rows.length">
          <tr
            v-for="row in rows"
            :key="rowKey(row)"
            class="transition-colors duration-150 hover:bg-sand/60"
            :class="clickable ? 'cursor-pointer' : ''"
            @click="clickable && emit('rowClick', row)"
          >
            <td v-for="c in columns" :key="c.key" class="px-4 py-3" :class="[ALIGN[c.align ?? 'left'], c.class]">
              <slot :name="`cell-${c.key}`" :row="row">{{ (row as Record<string, unknown>)[c.key] }}</slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <slot v-if="!loading && !rows.length" name="empty" />
  </div>
</template>
