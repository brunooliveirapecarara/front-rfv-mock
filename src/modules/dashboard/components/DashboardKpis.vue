<script setup lang="ts">
import { AlertTriangle, ShieldCheck, Sparkles, Users, Wallet } from 'lucide-vue-next'
import type { DashboardKpis } from '@/services/dashboard-service'
import StatCard from '@/components/ui/StatCard.vue'
import { formatNumber, formatPercent, formatWholeCurrency } from '@/utils/formatters'

defineProps<{ kpis: DashboardKpis | null; loading: boolean }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
    <StatCard label="Fornecedores ativos" :value="kpis ? formatNumber(kpis.activeSuppliers) : undefined" hint="últimos 12 meses" :icon="Users" tone="brand" :loading="loading" />
    <StatCard label="Novos" :value="kpis ? formatNumber(kpis.newSuppliers) : undefined" hint="primeiro fornecimento ≤ 90 dias" :icon="Sparkles" tone="info" :loading="loading" />
    <StatCard label="Em risco" :value="kpis ? formatNumber(kpis.atRisk) : undefined" hint="eram frequentes e sumiram" :icon="AlertTriangle" tone="danger" :loading="loading" />
    <StatCard label="Valor vendido" :value="kpis ? formatWholeCurrency(kpis.soldValue12m) : undefined" hint="12 meses" :icon="Wallet" tone="success" :loading="loading" />
    <StatCard label="Contactáveis" :value="kpis ? formatPercent(kpis.contactablePercent) : undefined" hint="com consentimento promocional" :icon="ShieldCheck" tone="warning" :loading="loading" />
  </div>
</template>
