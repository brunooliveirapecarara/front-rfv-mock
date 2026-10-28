import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CampaignDraft } from '@/types'
import { isoDaysAhead } from '@/utils/time'

/**
 * Cria um rascunho com valores padrão.
 *
 * @returns Rascunho inicial do wizard.
 */
function emptyDraft(): CampaignDraft {
  return {
    name: '',
    objective: '',
    segment: 'cooling',
    shopIds: [],
    channel: 'whatsapp',
    templateId: '',
    holdoutPercent: 10,
    capPerPerson: 2,
    cooldownDays: 14,
    startAt: isoDaysAhead(3),
    notAfter: isoDaysAhead(8),
  }
}

/** Estado do wizard de nova campanha. */
export const useCampaignDraftStore = defineStore('campaignDraft', () => {
  const draft = reactive<CampaignDraft>(emptyDraft())
  const step = ref(0)

  /** Volta o wizard ao estado inicial. */
  function reset(): void {
    Object.assign(draft, emptyDraft())
    step.value = 0
  }

  return { draft, step, reset }
})
