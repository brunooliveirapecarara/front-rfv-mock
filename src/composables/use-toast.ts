import { reactive } from 'vue'
import type { Tone } from '@/types'

export interface ToastItem {
  id: number
  tone: Exclude<Tone, 'neutral' | 'brand'>
  title: string
  message?: string
}

const toasts = reactive<ToastItem[]>([])
let nextId = 1

/**
 * Exibe um toast e o remove depois de alguns segundos.
 *
 * @param tone - Tipo do aviso.
 * @param title - Título curto.
 * @param message - Detalhe opcional.
 * @param duration - Tempo em ms até sumir.
 */
function push(tone: ToastItem['tone'], title: string, message?: string, duration = 4500): void {
  const id = nextId++
  toasts.push({ id, tone, title, message })
  setTimeout(() => dismiss(id), duration)
}

/**
 * Remove um toast.
 *
 * @param id - Id do toast.
 */
function dismiss(id: number): void {
  const index = toasts.findIndex((t) => t.id === id)
  if (index >= 0) toasts.splice(index, 1)
}

/**
 * Acesso global aos toasts de confirmação, sucesso, erro e alerta.
 *
 * @returns Lista reativa e atalhos por tipo.
 */
export function useToast() {
  return {
    toasts,
    dismiss,
    success: (title: string, message?: string) => push('success', title, message),
    error: (title: string, message?: string) => push('danger', title, message, 6500),
    warning: (title: string, message?: string) => push('warning', title, message, 5500),
    info: (title: string, message?: string) => push('info', title, message),
  }
}
