<script setup lang="ts">
import type { Campaign } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatDate } from '@/utils/formatters'

defineProps<{ campaign: Campaign }>()
</script>

<template>
  <BaseCard>
    <h2 class="text-lg font-bold">Regras e janela</h2>
    <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <div><dt class="text-xs font-semibold text-ink-muted">Holdout</dt><dd class="font-bold">{{ campaign.rules.holdoutPercent }}%</dd></div>
      <div><dt class="text-xs font-semibold text-ink-muted">Teto por pessoa</dt><dd class="font-bold">{{ campaign.rules.capPerPerson }} contatos</dd></div>
      <div><dt class="text-xs font-semibold text-ink-muted">Cooldown</dt><dd class="font-bold">{{ campaign.rules.cooldownDays }} dias</dd></div>
      <div><dt class="text-xs font-semibold text-ink-muted">Início</dt><dd class="font-bold">{{ formatDate(campaign.rules.startAt) }}</dd></div>
      <div><dt class="text-xs font-semibold text-ink-muted">Expira em (not_after)</dt><dd class="font-bold">{{ formatDate(campaign.rules.notAfter) }}</dd></div>
      <div><dt class="text-xs font-semibold text-ink-muted">Corte do holdout</dt><dd class="font-bold">teria recebido em {{ formatDate(campaign.holdoutCutoffDate) }}</dd></div>
      <div class="sm:col-span-2"><dt class="text-xs font-semibold text-ink-muted">Chave de idempotência</dt><dd class="font-mono text-xs font-bold">{{ campaign.keyPrefix }}:person:…</dd></div>
    </dl>
  </BaseCard>
</template>
