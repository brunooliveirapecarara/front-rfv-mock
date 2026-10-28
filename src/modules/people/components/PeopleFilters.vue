<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useDebounced } from '@/composables/use-debounced'
import type { PersonFilters } from '@/types'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { SEGMENTS, SEGMENT_ORDER } from '@/utils/segments'

const props = defineProps<{ filters: PersonFilters }>()
const emit = defineEmits<{ update: [patch: Partial<PersonFilters>] }>()

const search = ref(props.filters.search)
const debounced = useDebounced(search)
watch(debounced, (value) => emit('update', { search: value }))
watch(() => props.filters.search, (value) => (search.value = value))

const segmentOptions = SEGMENT_ORDER.map((s) => ({ value: s, label: SEGMENTS[s].label }))
const gradeOptions = ['A', 'B', 'C', 'D'].map((g) => ({ value: g, label: `Faixa ${g}` }))
const channelOptions = [
  { value: 'whatsapp', label: 'Contactável no WhatsApp' },
  { value: 'email', label: 'Contactável por e-mail' },
  { value: 'push', label: 'Contactável por push' },
]
const appOptions = [
  { value: 'yes', label: 'Com app' },
  { value: 'no', label: 'Sem app' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <BaseInput v-model="search" :icon="Search" placeholder="Buscar por nome" class="xl:col-span-2" />
      <BaseSelect :model-value="filters.segment" :options="segmentOptions" placeholder="Todos os segmentos" @update:model-value="emit('update', { segment: $event as PersonFilters['segment'] })" />
      <BaseSelect :model-value="filters.grade" :options="gradeOptions" placeholder="Todas as faixas" @update:model-value="emit('update', { grade: $event as PersonFilters['grade'] })" />
      <BaseSelect :model-value="filters.contactableChannel" :options="channelOptions" placeholder="Qualquer contato" @update:model-value="emit('update', { contactableChannel: $event as PersonFilters['contactableChannel'] })" />
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <div class="w-40"><BaseSelect :model-value="filters.hasApp === null ? '' : filters.hasApp ? 'yes' : 'no'" :options="appOptions" placeholder="App: todos" @update:model-value="emit('update', { hasApp: $event === '' ? null : $event === 'yes' })" /></div>
      <button v-if="filters.r !== null" type="button" class="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-soft px-3 text-sm font-semibold transition hover:bg-brand" @click="emit('update', { r: null })">R = {{ filters.r }} <X class="size-3.5" aria-hidden="true" /></button>
      <button v-if="filters.f !== null" type="button" class="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-soft px-3 text-sm font-semibold transition hover:bg-brand" @click="emit('update', { f: null })">F = {{ filters.f }} <X class="size-3.5" aria-hidden="true" /></button>
    </div>
  </div>
</template>
