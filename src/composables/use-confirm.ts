import { reactive } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  /** `danger` para ações destrutivas. */
  tone?: 'brand' | 'danger'
}

interface ConfirmState extends Required<ConfirmOptions> {
  open: boolean
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  tone: 'brand',
  resolve: null,
})

/**
 * Abre o diálogo de confirmação global.
 *
 * @param options - Textos e tom do diálogo.
 * @returns `true` se o usuário confirmar, `false` se cancelar.
 */
export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  Object.assign(state, { confirmLabel: 'Confirmar', cancelLabel: 'Cancelar', tone: 'brand', ...options, open: true })
  return new Promise<boolean>((resolve) => {
    state.resolve = resolve
  })
}

/**
 * Fecha o diálogo e resolve a promise pendente.
 *
 * @param value - Resposta do usuário.
 */
export function answerConfirm(value: boolean): void {
  state.open = false
  state.resolve?.(value)
  state.resolve = null
}

/** @returns Estado reativo do diálogo, para o `ConfirmDialog`. */
export function useConfirmState(): ConfirmState {
  return state
}
