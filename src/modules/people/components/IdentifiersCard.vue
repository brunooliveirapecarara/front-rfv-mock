<script setup lang="ts">
import { FileText, Mail, Phone, Smartphone } from 'lucide-vue-next'
import type { Person } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import { getShopName } from '@/services/shop-service'
import { REGISTRATION_SOURCES } from '@/utils/labels'
import { formatDate } from '@/utils/formatters'

defineProps<{ person: Person }>()
</script>

<template>
  <BaseCard>
    <h2 class="text-lg font-bold">Identificadores e cadastros</h2>
    <p class="text-sm text-ink-muted">Dados pessoais sempre mascarados.</p>
    <ul class="mt-4 flex flex-col gap-2.5 text-sm">
      <li class="flex items-center gap-3"><Phone class="size-4 text-ink-muted" aria-hidden="true" /><span :class="person.maskedPhone ? '' : 'text-ink-muted'">{{ person.maskedPhone ?? 'Sem telefone' }}</span></li>
      <li class="flex items-center gap-3"><Mail class="size-4 text-ink-muted" aria-hidden="true" /><span :class="person.maskedEmail ? '' : 'text-ink-muted'">{{ person.maskedEmail ?? 'Sem e-mail' }}</span></li>
      <li class="flex items-center gap-3"><FileText class="size-4 text-ink-muted" aria-hidden="true" />{{ person.maskedDocument }}</li>
      <li class="flex items-center gap-3"><Smartphone class="size-4 text-ink-muted" aria-hidden="true" />{{ person.hasApp ? 'Tem conta no app' : 'Sem conta no app' }}</li>
    </ul>
    <h3 class="mt-5 text-sm font-bold">Cadastros de origem</h3>
    <ul class="mt-2 flex flex-col gap-2">
      <li v-for="r in person.registrations" :key="r.registrationId" class="rounded-2xl bg-sand px-4 py-2.5 text-sm">
        <p class="font-semibold">{{ REGISTRATION_SOURCES[r.source] }}<span v-if="r.shopId"> · {{ getShopName(r.shopId) }}</span></p>
        <p class="text-xs text-ink-muted">{{ r.registrationId }} · desde {{ formatDate(r.createdAt) }}</p>
      </li>
    </ul>
  </BaseCard>
</template>
