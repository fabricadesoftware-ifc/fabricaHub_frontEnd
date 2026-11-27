// localStorage pode falhar (aba privada, armazenamento bloqueado): nunca quebra o app.

export function lerJson<T>(chave: string): T | null {
  try {
    const bruto = window.localStorage.getItem(chave)
    return bruto ? (JSON.parse(bruto) as T) : null
  } catch {
    return null
  }
}

export function salvarJson(chave: string, valor: unknown): void {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // sem armazenamento: a sessão dura só até recarregar a página
  }
}

export function remover(chave: string): void {
  try {
    window.localStorage.removeItem(chave)
  } catch {
    // ignora
  }
}
