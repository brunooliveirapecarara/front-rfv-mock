import type { Component } from 'vue'
import { Bell, FileText, Layers, LayoutDashboard, Megaphone, MessageCircle, Store, Users, Workflow } from 'lucide-vue-next'

export interface NavItem {
  label: string
  to: string
  icon: Component
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

/** Navegação principal agrupada; os caminhos em português fazem parte da interface. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Relacionamento',
    items: [
      { label: 'Painel', to: '/', icon: LayoutDashboard },
      { label: 'Fornecedores', to: '/fornecedores', icon: Users },
      { label: 'Segmentos', to: '/segmentos', icon: Layers },
    ],
  },
  {
    title: 'Comunicação',
    items: [
      { label: 'Campanhas', to: '/campanhas', icon: Megaphone },
      { label: 'Automações', to: '/automacoes', icon: Workflow },
      { label: 'Templates', to: '/templates', icon: FileText },
      { label: 'Conversas', to: '/conversas', icon: MessageCircle },
      { label: 'Notificações', to: '/notificacoes', icon: Bell },
    ],
  },
  { title: 'Rede', items: [{ label: 'Lojas', to: '/lojas', icon: Store }] },
]
