import type {
  AlertSeverity,
  BlockLayer,
  CampaignStatus,
  Channel,
  ConsentStatus,
  ConversationStatus,
  DeliveryStatus,
  MetaCategory,
  Purpose,
  RegistrationSource,
  TemplateStatus,
  Tone,
} from '@/types'

export interface Label {
  label: string
  tone: Tone
}

export const CHANNELS: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  sms: 'SMS',
  push: 'Push',
}

export const PURPOSES: Record<Purpose, string> = {
  autenticacao: 'Autenticação',
  transacional: 'Transacional',
  promocional: 'Promocional',
}

export const META_CATEGORIES: Record<MetaCategory, string> = {
  marketing: 'Marketing',
  utility: 'Utilidade',
  authentication: 'Autenticação',
}

/** Categoria Meta esperada para cada finalidade. */
export const EXPECTED_CATEGORY_BY_PURPOSE: Record<Purpose, MetaCategory> = {
  promocional: 'marketing',
  transacional: 'utility',
  autenticacao: 'authentication',
}

export const REGISTRATION_SOURCES: Record<RegistrationSource, string> = {
  bko_fornecedor: 'BKO · fornecedor',
  bko_cliente: 'BKO · cliente',
  app_usuario: 'App do fornecedor',
  central_contato: 'Central (sem cadastro)',
}

export const CONSENT_STATUS: Record<ConsentStatus, Label> = {
  granted: { label: 'Concedido', tone: 'success' },
  blocked: { label: 'Bloqueado', tone: 'danger' },
  no_record: { label: 'Sem registro', tone: 'neutral' },
}

export const CAMPAIGN_STATUS: Record<CampaignStatus, Label> = {
  draft: { label: 'Rascunho', tone: 'neutral' },
  scheduled: { label: 'Agendada', tone: 'info' },
  running: { label: 'Em execução', tone: 'success' },
  completed: { label: 'Concluída', tone: 'brand' },
  paused: { label: 'Pausada', tone: 'warning' },
}

export const TEMPLATE_STATUS: Record<TemplateStatus, Label> = {
  draft: { label: 'Rascunho', tone: 'neutral' },
  under_review: { label: 'Em análise', tone: 'info' },
  approved: { label: 'Aprovado', tone: 'success' },
  rejected: { label: 'Rejeitado', tone: 'danger' },
  category_mismatch: { label: 'Categoria divergente · travado', tone: 'warning' },
}

export const DELIVERY_STATUS: Record<DeliveryStatus, Label> = {
  queued: { label: 'Na fila', tone: 'neutral' },
  sent: { label: 'Enviada', tone: 'info' },
  delivered: { label: 'Entregue', tone: 'success' },
  read: { label: 'Lida', tone: 'brand' },
  failed: { label: 'Falha', tone: 'danger' },
  blocked_opt_out: { label: 'Bloqueada · opt-out', tone: 'danger' },
  expired: { label: 'Expirada', tone: 'warning' },
}

export const BLOCK_LAYERS: Record<BlockLayer, string> = {
  campaigns: 'Campanhas (público)',
  pr_notify: 'pr-notify (pessoa × finalidade)',
  central: 'Central (número no canal)',
}

export const CONVERSATION_STATUS: Record<ConversationStatus, Label> = {
  open: { label: 'Aberta', tone: 'success' },
  waiting: { label: 'Aguardando', tone: 'warning' },
  closed: { label: 'Encerrada', tone: 'neutral' },
}

export const ALERT_SEVERITY: Record<AlertSeverity, Label> = {
  info: { label: 'Informativo', tone: 'info' },
  warning: { label: 'Atenção', tone: 'warning' },
  critical: { label: 'Crítico', tone: 'danger' },
}
