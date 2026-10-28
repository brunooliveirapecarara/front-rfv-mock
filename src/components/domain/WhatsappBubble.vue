<script setup lang="ts">
defineProps<{ body: string; buttons?: string[]; time?: string; side?: 'in' | 'out' }>()
</script>

<template>
  <div class="flex flex-col gap-1" :class="side === 'in' ? 'items-start' : 'items-end'">
    <div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm" :class="side === 'in' ? 'rounded-tl-sm bg-surface' : 'rounded-tr-sm bg-brand-soft'">
      <p class="whitespace-pre-line">{{ body }}</p>
      <p v-if="time" class="mt-1 text-right text-[11px] text-ink-muted">{{ time }}</p>
    </div>
    <div v-if="buttons?.length" class="flex max-w-[85%] flex-col gap-1.5">
      <span v-for="b in buttons" :key="b" class="rounded-xl bg-surface px-4 py-2 text-center text-sm font-semibold text-info-ink shadow-sm">{{ b }}</span>
    </div>
  </div>
</template>
