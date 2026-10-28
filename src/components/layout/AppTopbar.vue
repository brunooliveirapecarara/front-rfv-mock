<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Bell, Menu } from 'lucide-vue-next'
import { countUnreadAlerts } from '@/services/notification-service'
import AppLogo from './AppLogo.vue'

defineEmits<{ menu: [] }>()
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur lg:hidden">
    <AppLogo />
    <div class="flex items-center gap-2">
      <RouterLink to="/notificacoes?tab=alerts" class="relative grid size-11 place-items-center rounded-full border-2 border-line transition hover:border-brand" aria-label="Alertas">
        <Bell class="size-5" aria-hidden="true" />
        <span v-if="countUnreadAlerts()" class="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-coral-ink text-[11px] font-bold text-white">{{ countUnreadAlerts() }}</span>
      </RouterLink>
      <button type="button" class="grid size-11 place-items-center rounded-full border-2 border-line transition hover:border-brand" aria-label="Abrir menu" @click="$emit('menu')"><Menu class="size-5" /></button>
    </div>
  </header>
</template>
