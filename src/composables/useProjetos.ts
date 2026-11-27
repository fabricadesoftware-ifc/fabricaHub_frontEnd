import { computed, ref } from 'vue'
import { projetosApi } from '@/api/projetos'
import { useProjetosStore } from '@/stores/projetos'

/** Projetos ficam na store (definem o papel de líder); aqui ficam carregando/erro. */
export function useProjetos() {
  const store = useProjetosStore()
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  async function carregar() {
    carregando.value = true
    erro.value = null
    try {
      store.substituir(await projetosApi.listar())
    } catch {
      erro.value = 'Não foi possível carregar os projetos.'
    } finally {
      carregando.value = false
    }
  }

  return { projetos: computed(() => store.lista), carregando, erro, carregar }
}
