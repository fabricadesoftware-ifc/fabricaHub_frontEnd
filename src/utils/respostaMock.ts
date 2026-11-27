/** Simula uma resposta de API: devolve uma cópia, nunca a referência do mock. */
export function respostaMock<T>(dado: T): Promise<T> {
  return Promise.resolve(structuredClone(dado))
}
