<script setup lang="ts">
import { computed } from 'vue'
import { useCampaignDraftStore } from '@/stores/campaign-draft'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const store = useCampaignDraftStore()

const startDate = computed({
  get: () => store.draft.startAt.slice(0, 10),
  set: (value: string | number) => (store.draft.startAt = `${value}T12:00:00.000Z`),
})
const notAfterDate = computed({
  get: () => store.draft.notAfter.slice(0, 10),
  set: (value: string | number) => (store.draft.notAfter = `${value}T12:00:00.000Z`),
})
const windowError = computed(() => (store.draft.notAfter <= store.draft.startAt ? 'A expiração precisa ser depois do início.' : undefined))
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="grid gap-5 sm:grid-cols-3">
      <BaseInput v-model="store.draft.holdoutPercent" type="number" label="Holdout (%)" :min="0" :max="50" hint="Parcela que não recebe, para medir o efeito." :error="store.draft.holdoutPercent < 0 || store.draft.holdoutPercent > 50 ? 'Use de 0 a 50.' : undefined" />
      <BaseInput v-model="store.draft.capPerPerson" type="number" label="Teto por pessoa" :min="1" :max="10" hint="Contatos em qualquer canal." />
      <BaseInput v-model="store.draft.cooldownDays" type="number" label="Cooldown (dias)" :min="0" :max="90" />
    </div>
    <div class="grid gap-5 sm:grid-cols-2">
      <BaseInput v-model="startDate" type="date" label="Início" />
      <BaseInput v-model="notAfterDate" type="date" label="Expira em (not_after)" :error="windowError" hint="Depois disso o pedido expira em vez de ser enviado." />
    </div>
    <BaseAlert tone="info" title="Como o holdout funciona">O holdout fica registrado nas Campanhas com a data em que a pessoa "teria recebido". Ele nunca é enviado ao pr-notify.</BaseAlert>
  </div>
</template>
