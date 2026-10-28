<script setup lang="ts">
import { useCampaignDraftStore } from '@/stores/campaign-draft'
import BaseInput from '@/components/ui/BaseInput.vue'

const store = useCampaignDraftStore()
</script>

<template>
  <div class="grid gap-5">
    <BaseInput v-model="store.draft.name" label="Nome da campanha" placeholder="Ex.: Esfriando · Black Friday" hint="Use um nome que o time reconheça nos relatórios." :error="store.draft.name.length > 0 && store.draft.name.trim().length < 3 ? 'Informe ao menos 3 caracteres.' : undefined" />
    <BaseInput v-model="store.draft.objective" label="Objetivo" placeholder="Ex.: Antecipar a entrega de peças para a Black Friday" />
  </div>
</template>
