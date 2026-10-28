import { shallowRef, ref, watchEffect, type Ref, type ShallowRef } from 'vue'

export interface AsyncData<T> {
  data: ShallowRef<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  reload: () => Promise<void>
}

/**
 * Carrega dados assíncronos e recarrega quando os valores reativos lidos de forma síncrona no getter mudam.
 * Respostas antigas são descartadas.
 *
 * @param load - Função que lê os filtros reativos (ex.: `{ ...filters }`) e chama o service.
 * @returns Dados, estado de carregamento, erro e `reload`.
 */
export function useAsyncData<T>(load: () => Promise<T>): AsyncData<T> {
  const data = shallowRef<T | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)
  let version = 0

  async function run(): Promise<void> {
    const current = ++version
    loading.value = true
    error.value = null
    try {
      const result = await load()
      if (current === version) data.value = result
    } catch (e) {
      if (current === version) error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      if (current === version) loading.value = false
    }
  }

  watchEffect(() => {
    void run()
  })

  return { data, loading, error, reload: run }
}
