import { computed, ref, shallowRef, type Ref } from 'vue'

/** Estado padrão de uma lista vinda da camada `api`: dados, carregando e erro. */
export function useLista<T>(buscar: () => Promise<T[]>, mensagemErro: string) {
  const dados = shallowRef<T[]>([]) as Ref<T[]>
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  async function carregar() {
    carregando.value = true
    erro.value = null
    try {
      dados.value = await buscar()
    } catch {
      erro.value = mensagemErro
    } finally {
      carregando.value = false
    }
  }

  return { dados, carregando, erro, carregar }
}

/** Igual a `useLista`, para um único registro (ex.: detalhe de projeto). `null` = não encontrado. */
export function useDado<T>(buscar: () => Promise<T | null>, mensagemErro: string) {
  const dado = shallowRef<T | null>(null) as Ref<T | null>
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  async function carregar() {
    carregando.value = true
    erro.value = null
    try {
      dado.value = await buscar()
    } catch {
      erro.value = mensagemErro
    } finally {
      carregando.value = false
    }
  }

  return { dado, carregando, erro, carregar }
}

interface Fonte {
  carregando: Ref<boolean>
  erro: Ref<string | null>
}

/** Junta o estado de várias fontes: carrega se qualquer uma carrega; o erro é o primeiro que houver. */
export function estadoDasFontes(fontes: Fonte[]) {
  return {
    carregando: computed(() => fontes.some((f) => f.carregando.value)),
    erro: computed(() => fontes.map((f) => f.erro.value).find(Boolean) ?? null),
  }
}
