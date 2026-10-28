<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{ total: number; pageSize: number }>()
const page = defineModel<number>({ required: true })
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
</script>

<template>
  <nav v-if="total > pageSize" class="flex items-center justify-between gap-3 text-sm" aria-label="Paginação">
    <span class="text-ink-muted">{{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, total) }} de {{ total }}</span>
    <div class="flex items-center gap-2">
      <button type="button" class="grid size-9 place-items-center rounded-full bg-sand transition hover:bg-brand-soft disabled:opacity-40" :disabled="page <= 1" aria-label="Página anterior" @click="page--">
        <ChevronLeft class="size-4" />
      </button>
      <span class="min-w-14 text-center font-semibold">{{ page }} / {{ pages }}</span>
      <button type="button" class="grid size-9 place-items-center rounded-full bg-sand transition hover:bg-brand-soft disabled:opacity-40" :disabled="page >= pages" aria-label="Próxima página" @click="page++">
        <ChevronRight class="size-4" />
      </button>
    </div>
  </nav>
</template>
