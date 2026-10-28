const SAMPLE_VALUES: Record<string, string> = {
  nome: 'Maria',
  marca: 'Farm',
  loja: 'Campinas',
  data_limite: '05/11',
  saldo: 'R$ 84,20',
  validade: '30/11',
  lote: 'R-123456',
  quantidade: '8',
}

/**
 * Preenche as variáveis `{{n}}` de um template com valores de exemplo.
 *
 * @param body - Corpo do template com `{{1}}`, `{{2}}`…
 * @param variables - Nomes das variáveis, na ordem.
 * @returns Texto de pré-visualização.
 */
export function renderTemplateBody(body: string, variables: string[]): string {
  return body.replace(/\{\{(\d+)\}\}/g, (_, index: string) => {
    const name = variables[Number(index) - 1] ?? ''
    return SAMPLE_VALUES[name] ?? `[${name}]`
  })
}
