<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'dark'
    size?: 'sm' | 'md' | 'lg'
    to?: RouteLocationRaw
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const VARIANTS = {
  primary: 'bg-brand text-ink hover:bg-brand-strong hover:shadow-card',
  outline: 'bg-surface text-ink border-2 border-brand hover:bg-brand-soft',
  ghost: 'text-ink hover:bg-sand',
  danger: 'bg-coral-ink text-white hover:brightness-110',
  dark: 'bg-ink text-white hover:bg-black',
}
const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-5 text-sm', lg: 'h-12 px-7 text-base' }

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none transition duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
  VARIANTS[props.variant],
  SIZES[props.size],
  props.block ? 'w-full' : '',
])
const attrs = computed(() => (props.to ? { to: props.to } : { type: props.type, disabled: props.disabled || props.loading }))
</script>

<template>
  <component :is="to ? RouterLink : 'button'" v-bind="attrs" :class="classes" :aria-busy="loading || undefined">
    <Loader2 v-if="loading" class="size-4 animate-spin" aria-hidden="true" />
    <slot />
  </component>
</template>
