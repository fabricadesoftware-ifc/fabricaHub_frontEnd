import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Projeto } from '@/utils/tipos'

/**
 * Projetos carregados: estado compartilhado porque define o papel
 * (líder = `idLead` de algum projeto). Quem carrega é `useProjetos`/`useAuth`.
 */
export const useProjetosStore = defineStore('projetos', () => {
  const lista = ref<Projeto[]>([])

  function substituir(projetos: Projeto[]) {
    lista.value = projetos
  }

  /** Troca um projeto pela versão atualizada (depois de editar, mudar membros etc.). */
  function atualizar(projeto: Projeto) {
    const i = lista.value.findIndex((p) => p.id === projeto.id)
    if (i >= 0) lista.value.splice(i, 1, projeto)
  }

  return { lista, substituir, atualizar }
})
