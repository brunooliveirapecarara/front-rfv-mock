import type { Component } from 'vue'
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-vue-next'
import type { Channel } from '@/types'

/** Ícone de cada canal. */
export const CHANNEL_ICONS: Record<Channel, Component> = {
  whatsapp: MessageCircle,
  email: Mail,
  sms: Smartphone,
  push: Bell,
}
