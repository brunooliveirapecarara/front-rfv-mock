<script setup lang="ts">
import type { Channel, Person } from '@/types'
import ChannelBadge from '@/components/domain/ChannelBadge.vue'
import LabelBadge from '@/components/domain/LabelBadge.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { findConsent } from '@/utils/consent'
import { formatDate } from '@/utils/formatters'
import { CONSENT_STATUS } from '@/utils/labels'

defineProps<{ person: Person }>()
const CHANNELS_LIST: Channel[] = ['whatsapp', 'email', 'sms', 'push']
</script>

<template>
  <BaseCard>
    <h2 class="text-lg font-bold">Consentimentos</h2>
    <p class="text-sm text-ink-muted">Livro por canal e finalidade (pr-notify).</p>
    <BaseAlert v-if="person.doNotContact" tone="danger" title="Não comunicável" class="mt-4">Pedido do titular: todos os canais bloqueados.</BaseAlert>
    <div class="mt-4 overflow-x-auto">
      <table class="w-full min-w-[420px] text-sm">
        <thead class="text-left text-xs uppercase text-ink-muted">
          <tr><th class="pb-2 font-semibold">Canal</th><th class="pb-2 font-semibold">Transacional</th><th class="pb-2 font-semibold">Promocional</th></tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr v-for="ch in CHANNELS_LIST" :key="ch">
            <td class="py-3 pr-3"><ChannelBadge :channel="ch" /></td>
            <td v-for="purpose in ['transacional', 'promocional'] as const" :key="purpose" class="py-3 pr-3">
              <template v-if="findConsent(person, ch, purpose)">
                <LabelBadge :value="CONSENT_STATUS[findConsent(person, ch, purpose)!.status]" size="sm" />
                <p v-if="findConsent(person, ch, purpose)!.occurredAt" class="mt-0.5 text-[11px] text-ink-muted">{{ findConsent(person, ch, purpose)!.source }} · {{ formatDate(findConsent(person, ch, purpose)!.occurredAt!) }}</p>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>
