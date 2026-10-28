<script setup lang="ts">
import { useAsyncData } from '@/composables/use-async-data'
import { getPerson, getTimeline } from '@/services/person-service'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import ConsentMatrix from '../components/ConsentMatrix.vue'
import IdentifiersCard from '../components/IdentifiersCard.vue'
import PersonHeader from '../components/PersonHeader.vue'
import PersonIndicators from '../components/PersonIndicators.vue'
import PersonTimeline from '../components/PersonTimeline.vue'
import RfvMetricCards from '../components/RfvMetricCards.vue'

const props = defineProps<{ personId: string }>()
const { data: person, loading, error, reload } = useAsyncData(() => getPerson(props.personId))
const { data: timeline, loading: loadingTimeline } = useAsyncData(() => getTimeline(props.personId))
</script>

<template>
  <ErrorState v-if="error" :message="error.message" @retry="reload" />
  <div v-else-if="loading || !person" class="flex flex-col gap-6">
    <BaseSkeleton class="h-36 w-full rounded-card" />
    <div class="grid gap-4 sm:grid-cols-3"><BaseSkeleton v-for="n in 3" :key="n" class="h-32 rounded-card" /></div>
    <BaseSkeleton class="h-64 w-full rounded-card" />
  </div>
  <div v-else class="flex flex-col gap-6">
    <PersonHeader :person="person" />
    <RfvMetricCards :person="person" />
    <div class="grid gap-6 xl:grid-cols-3">
      <div class="flex flex-col gap-6 xl:col-span-2">
        <PersonIndicators :person="person" />
        <PersonTimeline :events="timeline" :loading="loadingTimeline" />
      </div>
      <div class="flex flex-col gap-6">
        <ConsentMatrix :person="person" />
        <IdentifiersCard :person="person" />
      </div>
    </div>
  </div>
</template>
