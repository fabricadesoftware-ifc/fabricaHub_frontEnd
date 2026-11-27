/** Atraso simulado da "API" (ms), para os skeletons aparecerem. VITE_MOCK_DELAY=0 desliga. */
const ATRASO = Number(import.meta.env.VITE_MOCK_DELAY ?? 350)

/** Simula uma resposta de API: devolve uma cópia (nunca a referência do mock) depois de um atraso. */
export function respostaMock<T>(dado: T): Promise<T> {
  const copia = structuredClone(dado)
  if (!ATRASO) return Promise.resolve(copia)
  return new Promise((resolver) => setTimeout(() => resolver(copia), ATRASO))
}
