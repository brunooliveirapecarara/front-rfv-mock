<script setup lang="ts">
import { RotateCcw, XCircle } from 'lucide-vue-next'
import BaseButton from './BaseButton.vue'

defineProps<{ message?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 px-6 py-12 text-center" role="alert">
    <span class="grid size-14 place-items-center rounded-full bg-coral-soft text-coral-ink"><XCircle class="size-7" aria-hidden="true" /></span>
    <h3 class="text-base font-bold">Não foi possível carregar</h3>
    <p class="max-w-sm text-sm text-ink-muted">{{ message ?? 'Tente novamente em instantes.' }}</p>
    <BaseButton variant="outline" size="sm" @click="$emit('retry')"><RotateCcw class="size-4" aria-hidden="true" />Tentar de novo</BaseButton>
  </div>
</template>
