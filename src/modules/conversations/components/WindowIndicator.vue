<script setup lang="ts">
import { Clock, Lock } from 'lucide-vue-next'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { timeRemaining } from '@/utils/formatters'

defineProps<{ expiresAt: string | null }>()
</script>

<template>
  <BaseBadge v-if="expiresAt && timeRemaining(expiresAt) !== 'expirada'" tone="success"><Clock class="size-3.5" aria-hidden="true" />Janela de 24h aberta · restam {{ timeRemaining(expiresAt) }}</BaseBadge>
  <BaseBadge v-else tone="warning"><Lock class="size-3.5" aria-hidden="true" />Janela fechada · só template aprovado</BaseBadge>
</template>
