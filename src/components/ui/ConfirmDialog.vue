<script setup lang="ts">
import { AlertTriangle, HelpCircle } from 'lucide-vue-next'
import { answerConfirm, useConfirmState } from '@/composables/use-confirm'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

const state = useConfirmState()
</script>

<template>
  <BaseModal :open="state.open" :title="state.title" size="sm" @update:open="answerConfirm(false)">
    <div class="flex gap-3">
      <span class="grid size-10 shrink-0 place-items-center rounded-full" :class="state.tone === 'danger' ? 'bg-coral-soft text-coral-ink' : 'bg-brand-soft text-warning-ink'">
        <component :is="state.tone === 'danger' ? AlertTriangle : HelpCircle" class="size-5" aria-hidden="true" />
      </span>
      <p class="text-sm text-ink-muted">{{ state.message }}</p>
    </div>
    <template #footer>
      <BaseButton variant="ghost" @click="answerConfirm(false)">{{ state.cancelLabel }}</BaseButton>
      <BaseButton :variant="state.tone === 'danger' ? 'danger' : 'primary'" @click="answerConfirm(true)">{{ state.confirmLabel }}</BaseButton>
    </template>
  </BaseModal>
</template>
