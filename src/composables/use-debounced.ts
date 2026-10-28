import { ref, watch, type Ref } from 'vue'

/**
 * Espelha uma fonte reativa com atraso, para evitar uma busca a cada tecla.
 *
 * @param source - Valor reativo de origem.
 * @param delayMs - Atraso em milissegundos.
 * @returns Ref que acompanha a fonte após o atraso.
 */
export function useDebounced<T>(source: Ref<T>, delayMs = 250): Ref<T> {
  const output = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      output.value = value
    }, delayMs)
  })
  return output
}
