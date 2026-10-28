<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { PanelLeftClose, PanelLeftOpen, Plus, Store } from 'lucide-vue-next'
import { countUnreadAlerts } from '@/services/notification-service'
import { getShopOptions } from '@/services/shop-service'
import { useScopeStore } from '@/stores/scope'
import { useUiStore } from '@/stores/ui'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTooltip from '@/components/ui/BaseTooltip.vue'
import AppLogo from './AppLogo.vue'
import { NAV_GROUPS } from './navigation'

const route = useRoute()
const scope = useScopeStore()
const ui = useUiStore()

const props = withDefaults(defineProps<{ collapsible?: boolean }>(), { collapsible: false })
const collapsed = computed(() => props.collapsible && ui.sidebarCollapsed)
const shopOptions = getShopOptions()
const unreadAlerts = computed(() => {
  void route.fullPath
  return countUnreadAlerts()
})
const scopeValue = computed({
  get: () => scope.shopId ?? '',
  set: (value: string | number) => scope.setShop(value === '' ? null : Number(value)),
})

/**
 * Indica se o item de navegação está ativo na rota atual.
 *
 * @param to - Caminho do item.
 * @returns `true` para o caminho exato (painel) ou prefixo (demais).
 */
function isActive(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <div class="flex h-full flex-col gap-6 overflow-y-auto pt-6 pb-4" :class="collapsed ? 'items-center px-3' : 'px-4'">
    <div class="flex items-center justify-between" :class="collapsed ? '' : 'w-full px-2'">
      <AppLogo v-if="!collapsed" />
      <BaseTooltip v-if="collapsible" :text="collapsed ? 'Expandir menu' : 'Recolher menu'" :disabled="!collapsed">
        <button
          type="button"
          class="grid size-9 shrink-0 place-items-center rounded-full text-ink-muted transition hover:bg-sand hover:text-ink"
          :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'"
          :aria-expanded="!collapsed"
          @click="ui.toggleSidebar()"
        >
          <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" class="size-5" aria-hidden="true" />
        </button>
      </BaseTooltip>
    </div>

    <BaseTooltip v-if="collapsed" :text="`Loja: ${scope.label}`">
      <button type="button" class="grid size-11 shrink-0 place-items-center rounded-full border-2 border-line text-ink-muted transition hover:border-brand hover:text-ink" :aria-label="`Loja: ${scope.label}. Expandir menu para alterar`" @click="ui.toggleSidebar()">
        <Store class="size-5" aria-hidden="true" />
      </button>
    </BaseTooltip>
    <BaseSelect v-else v-model="scopeValue" :options="shopOptions" placeholder="Rede toda" label="Loja" label-tone="section" class="shrink-0" />

    <BaseTooltip v-if="collapsed" text="Nova campanha">
      <BaseButton to="/campanhas/nova" class="shrink-0 !px-0 size-11" aria-label="Nova campanha"><Plus class="size-5" aria-hidden="true" /></BaseButton>
    </BaseTooltip>
    <BaseButton v-else to="/campanhas/nova" block class="shrink-0"><Plus class="size-4" aria-hidden="true" />Nova campanha</BaseButton>

    <nav class="flex flex-1 flex-col gap-5" :class="collapsed ? 'items-center' : ''" aria-label="Principal">
      <div v-for="group in NAV_GROUPS" :key="group.title" :class="collapsed ? 'flex flex-col gap-1 border-t border-line pt-4 first:border-0 first:pt-0' : ''">
        <p v-if="!collapsed" class="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">{{ group.title }}</p>
        <BaseTooltip v-for="item in group.items" :key="item.to" :text="item.label" :disabled="!collapsed">
          <RouterLink
            :to="item.to"
            class="group relative flex items-center rounded-full text-sm font-semibold transition duration-150 hover:bg-sand"
            :class="[collapsed ? 'size-11 justify-center' : 'gap-3 px-3 py-2.5', isActive(item.to) ? 'bg-brand text-ink' : 'text-ink-muted hover:text-ink']"
            :aria-label="collapsed ? item.label : undefined"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            <component :is="item.icon" class="size-5 shrink-0" aria-hidden="true" />
            <span v-if="!collapsed" class="flex-1">{{ item.label }}</span>
            <template v-if="item.to === '/notificacoes' && unreadAlerts">
              <span v-if="!collapsed" class="grid h-5 min-w-5 place-items-center rounded-full bg-coral-ink px-1 text-[11px] font-bold text-white">{{ unreadAlerts }}</span>
              <span v-else class="absolute right-1 top-1 size-2.5 rounded-full bg-coral-ink" aria-hidden="true" />
            </template>
          </RouterLink>
        </BaseTooltip>
      </div>
    </nav>
  </div>
</template>
