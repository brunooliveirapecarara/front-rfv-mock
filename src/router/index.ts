import { createRouter, createWebHistory } from 'vue-router'

/** Rotas com lazy load por módulo; os caminhos em português fazem parte da interface. */
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('@/modules/dashboard/views/DashboardView.vue') },
    { path: '/fornecedores', name: 'suppliers', component: () => import('@/modules/people/views/PeopleListView.vue'), meta: { role: 'supplier' } },
    { path: '/fornecedores/:personId', name: 'supplier-detail', component: () => import('@/modules/people/views/PersonDetailView.vue'), props: true },
    { path: '/segmentos', name: 'segments', component: () => import('@/modules/segments/views/SegmentsView.vue') },
    { path: '/campanhas', name: 'campaigns', component: () => import('@/modules/campaigns/views/CampaignsListView.vue') },
    { path: '/campanhas/nova', name: 'campaign-new', component: () => import('@/modules/campaigns/views/CampaignWizardView.vue') },
    { path: '/campanhas/:campaignId', name: 'campaign-detail', component: () => import('@/modules/campaigns/views/CampaignDetailView.vue'), props: true },
    { path: '/automacoes', name: 'automations', component: () => import('@/modules/automations/views/AutomationsView.vue') },
    { path: '/templates', name: 'templates', component: () => import('@/modules/templates/views/TemplatesView.vue') },
    { path: '/conversas/:conversationId?', name: 'conversations', component: () => import('@/modules/conversations/views/ConversationsView.vue'), props: true },
    { path: '/notificacoes', name: 'notifications', component: () => import('@/modules/notifications/views/NotificationsView.vue') },
    { path: '/lojas', name: 'shops', component: () => import('@/modules/shops/views/ShopsView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
