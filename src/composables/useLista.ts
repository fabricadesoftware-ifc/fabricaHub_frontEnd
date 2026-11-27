import { ref, shallowRef, type Ref } from 'vue'

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
