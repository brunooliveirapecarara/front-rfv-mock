<script setup lang="ts">
import { ArrowLeft, Megaphone, MessageCircle } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import type { Person } from '@/types'
import SegmentBadge from '@/components/domain/SegmentBadge.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { getShopName } from '@/services/shop-service'
import { formatDate } from '@/utils/formatters'

defineProps<{ person: Person }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <RouterLink to="/fornecedores" class="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-ink"><ArrowLeft class="size-4" aria-hidden="true" />Fornecedores</RouterLink>
    <BaseCard class="rise-in flex flex-col gap-5 sm:flex-row sm:items-center">
      <BaseAvatar :name="person.name" size="lg" />
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold sm:text-3xl">{{ person.name }}</h1>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <SegmentBadge :segment="person.rfv.segment" />
          <BaseBadge tone="neutral">Nota {{ person.rfv.score }} · faixa {{ person.rfv.grade }}</BaseBadge>
          <BaseBadge v-for="role in person.roles" :key="role" tone="info">{{ role === 'supplier' ? 'Fornecedor' : 'Cliente' }}</BaseBadge>
        </div>
        <p class="mt-2 text-sm text-ink-muted">{{ person.shopIds.map(getShopName).join(', ') }} · {{ person.state }} · {{ person.ageRange }} anos · fornece desde {{ formatDate(person.profile.firstSupplyDate) }}</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <BaseButton to="/conversas" variant="outline"><MessageCircle class="size-4" aria-hidden="true" />Iniciar conversa</BaseButton>
        <BaseButton :to="{ path: '/campanhas/nova', query: { segment: person.rfv.segment } }"><Megaphone class="size-4" aria-hidden="true" />Adicionar a campanha</BaseButton>
      </div>
    </BaseCard>
  </div>
</template>
