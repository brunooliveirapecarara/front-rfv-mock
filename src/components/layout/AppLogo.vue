<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logoUrl from '@/assets/images/logo.svg'
</script>

<template>
  <RouterLink to="/" class="inline-block shrink-0" aria-label="Peça Rara Brechó · Relacionamento">
    <img :src="logoUrl" alt="Peça Rara Brechó" width="131" height="36" class="h-9 w-auto" />
  </RouterLink>
</template>
