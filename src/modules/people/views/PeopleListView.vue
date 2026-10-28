<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Megaphone } from 'lucide-vue-next'
import { useAsyncData } from '@/composables/use-async-data'
import { listPeople } from '@/services/person-service'
import { useScopeStore } from '@/stores/scope'
import type { PersonFilters, Role, RfvSegment } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import PeopleFilters from '../components/PeopleFilters.vue'
import PeopleTable from '../components/PeopleTable.vue'

const route = useRoute()
const router = useRouter()
const scope = useScopeStore()

/**
 * Lê um número da query string.
 *
 * @param value - Valor bruto da query.
 * @returns Número ou `null` quando ausente/inválido.
 */
function queryNumber(value: unknown): number | null {
  const n = Number(value)
  return value !== undefined && Number.isFinite(n) ? n : null
}

/**
 * Cria os filtros a partir da rota (papel e query).
 *
 * @returns Filtros iniciais.
 */
function filtersFromRoute(): PersonFilters {
  return {
    role: (route.meta.role as Role) ?? 'supplier',
    search: '',
    segment: (route.query.segment as RfvSegment) ?? '',
    shopId: null,
    grade: '',
    contactableChannel: '',
    hasApp: null,
    r: queryNumber(route.query.r),
    f: queryNumber(route.query.f),
    sortBy: 'score',
    direction: 'desc',
    page: 1,
    pageSize: 12,
  }
}

const filters = reactive<PersonFilters>(filtersFromRoute())
const { data, loading, error, reload } = useAsyncData(() => listPeople({ ...filters, shopId: scope.shopId }))

/**
 * Aplica alterações de filtro e volta para a primeira página.
 *
 * @param patch - Campos alterados.
 */
function updateFilters(patch: Partial<PersonFilters>): void {
  Object.assign(filters, patch, { page: 1 })
}

/**
 * Alterna a ordenação por uma coluna.
 *
 * @param key - Coluna escolhida.
 */
function toggleSort(key: PersonFilters['sortBy']): void {
  if (filters.sortBy === key) filters.direction = filters.direction === 'asc' ? 'desc' : 'asc'
  else Object.assign(filters, { sortBy: key, direction: key === 'name' ? 'asc' : 'desc' })
}

watch(
  () => route.query,
  () => Object.assign(filters, { segment: (route.query.segment as RfvSegment) ?? '', r: queryNumber(route.query.r), f: queryNumber(route.query.f), page: 1 }),
)
watch(
  () => scope.shopId,
  () => (filters.page = 1),
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader eyebrow="Pessoas" title="Fornecedores" :subtitle="`Quem fornece peças, com recência, frequência e valor. Escopo: ${scope.label}.`">
      <BaseButton to="/campanhas/nova" variant="outline"><Megaphone class="size-4" aria-hidden="true" />Nova campanha</BaseButton>
    </PageHeader>
    <BaseCard class="flex flex-col gap-5">
      <PeopleFilters :filters="filters" @update="updateFilters" />
      <ErrorState v-if="error" :message="error.message" @retry="reload" />
      <template v-else>
        <PeopleTable :people="data?.items ?? []" :loading="loading" :sort-by="filters.sortBy" :direction="filters.direction" @sort="toggleSort" @open="router.push(`/fornecedores/${$event.personId}`)" />
        <BasePagination v-if="data" v-model="filters.page" :total="data.total" :page-size="filters.pageSize" />
      </template>
    </BaseCard>
  </div>
</template>
