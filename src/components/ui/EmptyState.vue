<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{ title: string; description?: string; icon?: Component }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <span class="grid size-14 place-items-center rounded-full bg-sand text-ink-muted"><component :is="icon ?? Inbox" class="size-7" aria-hidden="true" /></span>
    <h3 class="text-base font-bold">{{ title }}</h3>
    <p v-if="description" class="max-w-sm text-sm text-ink-muted">{{ description }}</p>
    <slot />
  </div>
</template>
